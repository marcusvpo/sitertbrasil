import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.rtbrasilimport.com.br";
const ROUTES = [
  "/",
  "/motorex",
  "/seja-revendedor",
  "/quem-somos",
  "/parceiros",
  "/depoimentos",
  "/blog",
  "/central-atendimento",
  "/guia/qual-oleo-motocross-trilha-enduro",
  "/glossario",
  "/faq",
];

function pick(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function audit(html: string) {
  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i);
  const description = pick(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
  );
  const ogImage = pick(
    html,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i
  );
  const canonical = pick(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i
  );
  const h1Matches = html.match(/<h1[\s>]/gi) || [];
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const wordCount = text.split(" ").filter(Boolean).length;

  const checks: { id: string; label: string; ok: boolean; weight: number; note?: string }[] = [
    { id: "title", label: "Title presente (30-60)", ok: !!title && title.length >= 30 && title.length <= 60, weight: 15, note: title ? `${title.length} chars` : "ausente" },
    { id: "description", label: "Description (120-160)", ok: !!description && description.length >= 120 && description.length <= 160, weight: 15, note: description ? `${description.length} chars` : "ausente" },
    { id: "h1", label: "Exatamente 1 H1", ok: h1Matches.length === 1, weight: 15, note: `${h1Matches.length} H1` },
    { id: "canonical", label: "Canonical URL", ok: !!canonical, weight: 10 },
    { id: "og_image", label: "OG Image", ok: !!ogImage, weight: 10 },
    { id: "content", label: "Conteúdo > 300 palavras", ok: wordCount >= 300, weight: 10, note: `${wordCount} palavras` },
    { id: "viewport", label: "Viewport tag", ok: /name=["']viewport["']/i.test(html), weight: 5 },
    { id: "lang", label: "<html lang>", ok: /<html[^>]+lang=/i.test(html), weight: 5 },
    { id: "twitter", label: "Twitter card", ok: /name=["']twitter:card["']/i.test(html), weight: 5 },
    { id: "schema", label: "Schema.org JSON-LD", ok: /application\/ld\+json/i.test(html), weight: 10 },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const score = Math.round(
    (checks.filter((c) => c.ok).reduce((s, c) => s + c.weight, 0) / totalWeight) * 100
  );

  return {
    score,
    checks,
    title,
    description,
    h1_count: h1Matches.length,
    has_canonical: !!canonical,
    has_og_image: !!ogImage,
    word_count: wordCount,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const routes: string[] = Array.isArray(body.routes) && body.routes.length ? body.routes : ROUTES;

    const results: any[] = [];
    for (const route of routes) {
      try {
        const r = await fetch(`${SITE_URL}${route}`, {
          headers: { "User-Agent": "RTBrasil-SEO-Audit/1.0" },
        });
        const html = await r.text();
        const a = audit(html);
        const insert = {
          route,
          score: a.score,
          checks: a.checks,
          title: a.title,
          description: a.description,
          h1_count: a.h1_count,
          has_canonical: a.has_canonical,
          has_og_image: a.has_og_image,
          word_count: a.word_count,
        };
        await supabase.from("seo_audit_results").insert(insert);
        results.push(insert);
      } catch (e) {
        results.push({ route, error: String(e) });
      }
    }

    return new Response(JSON.stringify({ ok: true, count: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
