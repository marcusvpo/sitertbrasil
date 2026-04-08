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
  texts?: { description?: string; short_description?: string };
  skus?: { data: Array<{ price_sale: number; price_discount: number; sku: string }> };
  images?: { data: Array<{ id: number; url: string; order: number }> };
  categories?: { data: Array<{ id: number; name: string; slug: string }> };
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

    // Verify the user is admin
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

    // Check admin role
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

    // Fetch from Yampi
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

    // Paginate through all products
    let page = 1;
    let allProducts: YampiProduct[] = [];
    let hasMore = true;

    while (hasMore) {
      const url = `${YAMPI_BASE}/${alias}/catalog/products?include=skus,images,categories&limit=100&page=${page}`;
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

    for (const yp of allProducts) {
      // Upsert category
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

      // Map product
      const sku = yp.skus?.data?.[0];
      const productData = {
        yampi_id: yp.id,
        yampi_slug: yp.slug,
        yampi_sku: sku?.sku || null,
        yampi_url: yp.url || null,
        name: yp.name,
        slug: yp.slug,
        description: yp.texts?.description || null,
        short_description: yp.texts?.short_description || null,
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

      // Sync images
      if (yp.images?.data?.length) {
        // Remove old yampi images for this product
        await adminClient
          .from("product_images")
          .delete()
          .eq("product_id", productId)
          .not("yampi_id", "is", null);

        // Insert new images
        const imageRows = yp.images.data.map((img, idx) => ({
          product_id: productId,
          yampi_id: img.id,
          external_url: img.url,
          storage_path: null,
          sort_order: img.order ?? idx,
        }));

        await adminClient.from("product_images").insert(imageRows);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: allProducts.length,
        created,
        updated,
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
