// Build-time sitemap generator. Reads products + blog posts from Supabase
// (public anon, only is_active rows) and writes public/sitemap.xml.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE = "https://www.rtbrasilimport.com.br";
const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YWZpdnlyb2J2Y3NmZ2xvdnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDEyMDYsImV4cCI6MjA4ODkxNzIwNn0.q4tdw7K0Z0kWLXG0z6dcC9T6DzgJOVPdKFR-_5W4Gqk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/motorex", priority: "0.9", changefreq: "weekly" },
  { loc: "/quem-somos", priority: "0.7", changefreq: "monthly" },
  { loc: "/seja-revendedor", priority: "0.8", changefreq: "monthly" },
  { loc: "/parceiros", priority: "0.7", changefreq: "monthly" },
  { loc: "/parceiros/lorenzo-ricken", priority: "0.6", changefreq: "monthly" },
  { loc: "/parceiros/otavio-oliveira", priority: "0.6", changefreq: "monthly" },
  { loc: "/parceiros/rodrigo-galiotto", priority: "0.6", changefreq: "monthly" },
  { loc: "/parceiros/marcelo-galiotto", priority: "0.6", changefreq: "monthly" },
  { loc: "/depoimentos", priority: "0.6", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/central-atendimento", priority: "0.6", changefreq: "monthly" },
  { loc: "/guia/qual-oleo-motocross-trilha-enduro", priority: "0.9", changefreq: "monthly" },
  { loc: "/glossario", priority: "0.7", changefreq: "monthly" },
  { loc: "/faq", priority: "0.6", changefreq: "monthly" },
];

async function build() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, updated_at")
    .eq("is_active", true);

  const urls = [
    ...STATIC_ROUTES.map((r) => ({
      loc: `${SITE}${r.loc}`,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...(products ?? []).map((p) => ({
      loc: `${SITE}/motorex/${p.slug}`,
      lastmod: (p.updated_at ?? today).slice(0, 10),
      changefreq: "weekly",
      priority: "0.8",
    })),
    ...(posts ?? []).map((p) => ({
      loc: `${SITE}/blog#${p.id}`,
      lastmod: (p.updated_at ?? today).slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const out = resolve(process.cwd(), "public/sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`✓ sitemap.xml written with ${urls.length} URLs → ${out}`);
}

build().catch((err) => {
  console.error("Sitemap generation failed (non-fatal):", err.message);
  process.exit(0);
});
