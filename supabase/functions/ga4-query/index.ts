import { getGoogleAccessToken, corsHeaders } from "../_shared/google-auth.ts";

const GA4_PROPERTY_ID = "536310380";

interface RunReportBody {
  dateRanges: { startDate: string; endDate: string }[];
  dimensions?: { name: string }[];
  metrics: { name: string }[];
  orderBys?: any[];
  limit?: number;
}

async function runReport(body: RunReportBody) {
  const token = await getGoogleAccessToken();
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
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
    throw new Error(`GA4 API [${res.status}]: ${text}`);
  }
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startDate = "7daysAgo", endDate = "today", report = "overview" } =
      await req.json().catch(() => ({}));

    const dateRanges = [{ startDate, endDate }];
    let result: any = {};

    if (report === "overview" || report === "all") {
      result.overview = await runReport({
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "conversions" },
        ],
      });
    }

    if (report === "topPages" || report === "all") {
      result.topPages = await runReport({
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 20,
      });
    }

    if (report === "sources" || report === "all") {
      result.sources = await runReport({
        dateRanges,
        dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 15,
      });
    }

    if (report === "devices" || report === "all") {
      result.devices = await runReport({
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
      });
    }

    if (report === "timeseries" || report === "all") {
      result.timeseries = await runReport({
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ga4-query error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
