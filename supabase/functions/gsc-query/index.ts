import { getGoogleAccessToken, corsHeaders } from "../_shared/google-auth.ts";

const SITE_URL = "https://www.rtbrasilimport.com.br/";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

async function gscSearch(body: any) {
  const token = await getGoogleAccessToken();
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC API [${res.status}]: ${text}`);
  }
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      startDate = daysAgo(28),
      endDate = daysAgo(1),
      report = "overview",
    } = await req.json().catch(() => ({}));

    const result: any = {};

    if (report === "overview" || report === "all") {
      result.overview = await gscSearch({
        startDate, endDate,
        dimensions: [],
      });
    }

    if (report === "queries" || report === "all") {
      result.queries = await gscSearch({
        startDate, endDate,
        dimensions: ["query"],
        rowLimit: 50,
      });
    }

    if (report === "pages" || report === "all") {
      result.pages = await gscSearch({
        startDate, endDate,
        dimensions: ["page"],
        rowLimit: 50,
      });
    }

    if (report === "timeseries" || report === "all") {
      result.timeseries = await gscSearch({
        startDate, endDate,
        dimensions: ["date"],
      });
    }

    if (report === "devices" || report === "all") {
      result.devices = await gscSearch({
        startDate, endDate,
        dimensions: ["device"],
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("gsc-query error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
