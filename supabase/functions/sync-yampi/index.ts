import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const YAMPI_BASE = "https://api.dooki.com.br/v2";

interface YampiProduct {
  id: number;
  name: string;
  slug: string;
  url: string;
  is_active: boolean;
  texts?: any;
  skus?: { data: Array<{ price_sale: number; price_discount: number; sku: string }> };
  images?: any;
  categories?: { data: Array<{ id: number; name: string; slug: string }> };
  image_url?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate admin JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const alias = Deno.env.get("YAMPI_ALIAS");
    const token = Deno.env.get("YAMPI_TOKEN");
    const secretKey = Deno.env.get("YAMPI_SECRET_KEY");

    if (!alias || !token || !secretKey) {
      return new Response(JSON.stringify({ error: "Yampi credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const yampiHeaders = {
      "User-Token": token,
      "User-Secret-Key": secretKey,
      "Content-Type": "application/json",
    };

    // ── Step 1: Paginate through all products ──
    let page = 1;
    let allProducts: YampiProduct[] = [];
    let hasMore = true;

    while (hasMore) {
      const url = `${YAMPI_BASE}/${alias}/catalog/products?include=texts,skus,categories&limit=100&page=${page}`;
      const resp = await fetch(url, { headers: yampiHeaders });

      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`Yampi API error [${resp.status}]: ${body}`);
      }

      const json = await resp.json();
      const products: YampiProduct[] = json.data || [];
      allProducts = allProducts.concat(products);

      const meta = json.meta;
      hasMore = meta && meta.pagination && page < meta.pagination.total_pages;
      page++;
    }

    let created = 0;
    let updated = 0;
    let imagessynced = 0;

    for (const yp of allProducts) {
      // ── Upsert category ──
      let categoryId: string | null = null;
      const cat = yp.categories?.data?.[0];
      if (cat) {
        const { data: catData } = await adminClient
          .from("product_categories")
          .upsert(
            { yampi_id: cat.id, name: cat.name, slug: cat.slug, sort_order: 0 },
            { onConflict: "yampi_id" }
          )
          .select("id")
          .single();
        categoryId = catData?.id || null;
      }

      // ── Map product data ──
      const sku = yp.skus?.data?.[0];
      const textsObj = yp.texts as any;
      const description = textsObj?.description || textsObj?.data?.description || null;
      const shortDescription = textsObj?.short_description || textsObj?.data?.short_description || null;

      const productData = {
        yampi_id: yp.id,
        yampi_slug: yp.slug,
        yampi_sku: sku?.sku || null,
        yampi_url: yp.url || null,
        name: yp.name,
        slug: yp.slug,
        description,
        short_description: shortDescription,
        price: sku?.price_sale || null,
        compare_price: sku?.price_discount || null,
        category_id: categoryId,
        is_active: yp.is_active,
        synced_at: new Date().toISOString(),
      };

      // Check if exists
      const { data: existing } = await adminClient
        .from("products")
        .select("id")
        .eq("yampi_id", yp.id)
        .maybeSingle();

      let productId: string;

      if (existing) {
        const { data: updatedProduct } = await adminClient
          .from("products")
          .update(productData)
          .eq("yampi_id", yp.id)
          .select("id")
          .single();
        productId = updatedProduct!.id;
        updated++;
      } else {
        const { data: newProduct } = await adminClient
          .from("products")
          .insert(productData)
          .select("id")
          .single();
        productId = newProduct!.id;
        created++;
      }

      // ── Step 2: Fetch images separately per product via dedicated endpoint ──
      let yampiImages: any[] = [];
      try {
        const imgResp = await fetch(
          `${YAMPI_BASE}/${alias}/catalog/products/${yp.id}/images?limit=50`,
          { headers: yampiHeaders }
        );
        if (imgResp.ok) {
          const imgJson = await imgResp.json();
          yampiImages = imgJson.data || [];
        } else {
          console.warn(`Failed to fetch images for product ${yp.id} (${yp.name}): ${imgResp.status}`);
        }
      } catch (imgErr) {
        console.warn(`Error fetching images for product ${yp.id}:`, imgErr);
      }

      // Fallback: try images from the product include if dedicated endpoint returned nothing
      if (yampiImages.length === 0) {
        const imagesRaw = yp.images as any;
        yampiImages = Array.isArray(imagesRaw) ? imagesRaw : (imagesRaw?.data || []);
      }

      console.log(`Product "${yp.name}" (yampi_id=${yp.id}): ${yampiImages.length} images found`);

      // ── Step 3: Upsert images — NEVER delete if we have nothing to replace ──
      if (yampiImages.length > 0) {
        const imageRows = yampiImages.map((img: any, idx: number) => {
          const externalUrl = img.url || img.image_url || img.src || img.thumb || null;
          return {
            product_id: productId,
            yampi_id: img.id || null,
            external_url: externalUrl,
            storage_path: null,
            sort_order: img.order ?? img.sort_order ?? idx,
          };
        });

        // Filter out images without a valid URL
        const validImages = imageRows.filter((r: any) => r.external_url);

        if (validImages.length > 0) {
          // Remove old yampi images for this product ONLY when we have replacements
          await adminClient
            .from("product_images")
            .delete()
            .eq("product_id", productId)
            .not("yampi_id", "is", null);

          const { error: imgError } = await adminClient
            .from("product_images")
            .insert(validImages);

          if (imgError) {
            console.error(`Insert images error for ${yp.name}:`, imgError);
          } else {
            imagessynced += validImages.length;
          }
        } else {
          console.warn(`Product "${yp.name}": all ${yampiImages.length} images had no valid URL, keeping existing images`);
        }
      } else {
        // No images from Yampi — keep whatever images exist, do NOT delete
        console.log(`Product "${yp.name}": no images from Yampi, preserving existing images`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: allProducts.length,
        created,
        updated,
        imagesSync: imagessynced,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("sync-yampi error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
