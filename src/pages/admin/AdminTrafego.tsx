import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePeriod } from "@/contexts/PeriodContext";
import { format } from "date-fns";
import {
  BarChart3, Users, MousePointerClick, Eye, Clock, TrendingUp,
  Search, Globe, Smartphone, Monitor, Tablet, ArrowUpRight, AlertTriangle,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";

// ---------- Helpers ----------
const fmtNum = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(Math.round(n || 0));
const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
const fmtSec = (n: number) => {
  const s = Math.round(n || 0);
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
};
const ga4Date = (d: Date) => format(d, "yyyy-MM-dd");
const parseGa4Date = (s: string) =>
  `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

async function callFn(name: string, body: any) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: any = null;
  try { parsed = JSON.parse(text); } catch { /* keep text */ }
  if (!res.ok) {
    const msg = parsed?.error || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  if (parsed?.error) throw new Error(parsed.error);
  return parsed;
}

// ---------- KPI card ----------
const Kpi = ({
  icon: Icon, label, value, hint,
}: {
  icon: any; label: string; value: string; hint?: string;
}) => (
  <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider">
        {label}
      </span>
      <Icon size={16} className="text-primary" />
    </div>
    <div className="text-secondary-foreground text-2xl font-heading">{value}</div>
    {hint && <div className="text-secondary-foreground/40 text-xs mt-1">{hint}</div>}
  </div>
);

const Section = ({ title, children, action }: any) => (
  <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg">
    <div className="px-5 py-3 border-b border-secondary-foreground/10 flex items-center justify-between">
      <h3 className="font-heading uppercase tracking-wider text-secondary-foreground text-sm">
        {title}
      </h3>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Loading = () => (
  <div className="flex items-center justify-center h-40">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const ErrorBox = ({ msg }: { msg: string }) => (
  <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-md p-4 text-sm text-destructive">
    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
    <div className="break-all">{msg}</div>
  </div>
);

// ---------- GA4 Tab ----------
const Ga4Tab = () => {
  const { from, to } = usePeriod();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true); setError(null);
    callFn("ga4-query", {
      report: "all",
      startDate: ga4Date(from),
      endDate: ga4Date(to),
    })
      .then((d) => { if (!cancel) setData(d); })
      .catch((e) => { if (!cancel) setError(e.message); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [from, to]);

  const overview = useMemo(() => {
    const row = data?.overview?.rows?.[0]?.metricValues || [];
    return {
      users: +(row[0]?.value || 0),
      sessions: +(row[1]?.value || 0),
      pageViews: +(row[2]?.value || 0),
      bounceRate: +(row[3]?.value || 0),
      avgDuration: +(row[4]?.value || 0),
      conversions: +(row[5]?.value || 0),
    };
  }, [data]);

  const timeseries = useMemo(() => {
    const rows = data?.timeseries?.rows || [];
    return rows
      .map((r: any) => ({
        date: parseGa4Date(r.dimensionValues[0].value),
        users: +r.metricValues[0].value,
        sessions: +r.metricValues[1].value,
      }))
      .sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [data]);

  const topPages = useMemo(
    () => (data?.topPages?.rows || []).slice(0, 10).map((r: any) => ({
      path: r.dimensionValues[0].value,
      views: +r.metricValues[0].value,
      users: +r.metricValues[1].value,
    })),
    [data],
  );

  const sources = useMemo(
    () => (data?.sources?.rows || []).slice(0, 10).map((r: any) => ({
      source: r.dimensionValues[0].value,
      medium: r.dimensionValues[1].value,
      sessions: +r.metricValues[0].value,
      users: +r.metricValues[1].value,
    })),
    [data],
  );

  const devices = useMemo(
    () => (data?.devices?.rows || []).map((r: any) => ({
      device: r.dimensionValues[0].value,
      sessions: +r.metricValues[0].value,
      users: +r.metricValues[1].value,
    })),
    [data],
  );

  if (loading) return <Loading />;
  if (error) return <ErrorBox msg={`GA4: ${error}`} />;

  const deviceIcon = (d: string) =>
    d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Kpi icon={Users} label="Usuários" value={fmtNum(overview.users)} />
        <Kpi icon={MousePointerClick} label="Sessões" value={fmtNum(overview.sessions)} />
        <Kpi icon={Eye} label="Pageviews" value={fmtNum(overview.pageViews)} />
        <Kpi icon={TrendingUp} label="Taxa de Rejeição" value={fmtPct(overview.bounceRate)} />
        <Kpi icon={Clock} label="Tempo Médio" value={fmtSec(overview.avgDuration)} />
        <Kpi icon={ArrowUpRight} label="Conversões" value={fmtNum(overview.conversions)} />
      </div>

      <Section title="Usuários e Sessões por Dia">
        {timeseries.length === 0 ? (
          <p className="text-secondary-foreground/50 text-sm">Sem dados no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeseries}>
              <CartesianGrid stroke="hsl(var(--secondary-foreground) / 0.08)" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--secondary-foreground) / 0.4)" fontSize={11} />
              <YAxis stroke="hsl(var(--secondary-foreground) / 0.4)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--secondary))",
                  border: "1px solid hsl(var(--secondary-foreground) / 0.2)",
                  borderRadius: 6,
                }}
              />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Usuários" />
              <Line type="monotone" dataKey="sessions" stroke="hsl(var(--secondary-foreground) / 0.5)" strokeWidth={2} dot={false} name="Sessões" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Páginas mais Vistas">
          {topPages.length === 0 ? (
            <p className="text-secondary-foreground/50 text-sm">Sem dados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-secondary-foreground/40 text-xs uppercase font-heading tracking-wider">
                  <th className="text-left pb-2">Página</th>
                  <th className="text-right pb-2">Views</th>
                  <th className="text-right pb-2">Usuários</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p: any) => (
                  <tr key={p.path} className="border-t border-secondary-foreground/5">
                    <td className="py-2 text-secondary-foreground/80 truncate max-w-[260px]">{p.path}</td>
                    <td className="py-2 text-right text-secondary-foreground">{fmtNum(p.views)}</td>
                    <td className="py-2 text-right text-secondary-foreground/70">{fmtNum(p.users)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="Fontes de Tráfego">
          {sources.length === 0 ? (
            <p className="text-secondary-foreground/50 text-sm">Sem dados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-secondary-foreground/40 text-xs uppercase font-heading tracking-wider">
                  <th className="text-left pb-2">Origem / Meio</th>
                  <th className="text-right pb-2">Sessões</th>
                  <th className="text-right pb-2">Usuários</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s: any, i: number) => (
                  <tr key={i} className="border-t border-secondary-foreground/5">
                    <td className="py-2 text-secondary-foreground/80">
                      {s.source} <span className="text-secondary-foreground/40">/ {s.medium}</span>
                    </td>
                    <td className="py-2 text-right text-secondary-foreground">{fmtNum(s.sessions)}</td>
                    <td className="py-2 text-right text-secondary-foreground/70">{fmtNum(s.users)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      </div>

      <Section title="Dispositivos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((d: any) => {
            const Icon = deviceIcon(d.device);
            const total = devices.reduce((a: number, b: any) => a + b.sessions, 0);
            const pct = total ? d.sessions / total : 0;
            return (
              <div key={d.device} className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-secondary-foreground/80 text-sm capitalize">
                    <Icon size={14} className="text-primary" /> {d.device}
                  </div>
                  <span className="text-secondary-foreground/50 text-xs">{fmtPct(pct)}</span>
                </div>
                <div className="text-secondary-foreground font-heading text-xl">{fmtNum(d.sessions)}</div>
                <div className="text-secondary-foreground/40 text-xs">{fmtNum(d.users)} usuários</div>
                <div className="mt-3 h-1.5 bg-secondary-foreground/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

// ---------- GSC Tab ----------
const GscTab = () => {
  const { from, to } = usePeriod();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GSC tem delay de ~2 dias
  const gscFrom = ga4Date(from);
  const gscTo = ga4Date(new Date(Date.now() - 2 * 86400000));

  useEffect(() => {
    let cancel = false;
    setLoading(true); setError(null);
    callFn("gsc-query", { report: "all", startDate: gscFrom, endDate: gscTo })
      .then((d) => { if (!cancel) setData(d); })
      .catch((e) => { if (!cancel) setError(e.message); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [gscFrom, gscTo]);

  const overview = useMemo(() => {
    const r = data?.overview?.rows?.[0];
    return {
      clicks: r?.clicks || 0,
      impressions: r?.impressions || 0,
      ctr: r?.ctr || 0,
      position: r?.position || 0,
    };
  }, [data]);

  const queries = useMemo(
    () => (data?.queries?.rows || []).slice(0, 25),
    [data],
  );
  const pages = useMemo(
    () => (data?.pages?.rows || []).slice(0, 25),
    [data],
  );
  const timeseries = useMemo(
    () => (data?.timeseries?.rows || [])
      .map((r: any) => ({
        date: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
      }))
      .sort((a: any, b: any) => a.date.localeCompare(b.date)),
    [data],
  );
  const devices = useMemo(() => data?.devices?.rows || [], [data]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox msg={`Search Console: ${error}`} />;

  const positionTone = (p: number) =>
    p <= 3 ? "text-green-400" : p <= 10 ? "text-primary" : "text-secondary-foreground/60";

  return (
    <div className="space-y-6">
      <p className="text-secondary-foreground/40 text-xs">
        Dados do Search Console (defasagem ~2 dias). Período: {gscFrom} → {gscTo}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon={MousePointerClick} label="Cliques" value={fmtNum(overview.clicks)} />
        <Kpi icon={Eye} label="Impressões" value={fmtNum(overview.impressions)} />
        <Kpi icon={TrendingUp} label="CTR" value={fmtPct(overview.ctr)} />
        <Kpi icon={BarChart3} label="Posição Média" value={overview.position.toFixed(1)} />
      </div>

      <Section title="Cliques e Impressões por Dia">
        {timeseries.length === 0 ? (
          <p className="text-secondary-foreground/50 text-sm">Sem dados.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={timeseries}>
              <CartesianGrid stroke="hsl(var(--secondary-foreground) / 0.08)" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--secondary-foreground) / 0.4)" fontSize={11} />
              <YAxis yAxisId="l" stroke="hsl(var(--primary))" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--secondary-foreground) / 0.4)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--secondary))",
                  border: "1px solid hsl(var(--secondary-foreground) / 0.2)",
                  borderRadius: 6,
                }}
              />
              <Line yAxisId="l" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Cliques" />
              <Line yAxisId="r" type="monotone" dataKey="impressions" stroke="hsl(var(--secondary-foreground) / 0.5)" strokeWidth={2} dot={false} name="Impressões" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Top Queries">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-secondary-foreground/40 text-xs uppercase font-heading tracking-wider">
                  <th className="text-left pb-2">Query</th>
                  <th className="text-right pb-2">Clicks</th>
                  <th className="text-right pb-2">Impr.</th>
                  <th className="text-right pb-2">CTR</th>
                  <th className="text-right pb-2">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((q: any, i: number) => (
                  <tr key={i} className="border-t border-secondary-foreground/5">
                    <td className="py-2 text-secondary-foreground/80 truncate max-w-[200px]">{q.keys[0]}</td>
                    <td className="py-2 text-right text-secondary-foreground">{fmtNum(q.clicks)}</td>
                    <td className="py-2 text-right text-secondary-foreground/70">{fmtNum(q.impressions)}</td>
                    <td className="py-2 text-right text-secondary-foreground/70">{fmtPct(q.ctr)}</td>
                    <td className={cn("py-2 text-right", positionTone(q.position))}>{q.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Top Páginas">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-secondary-foreground/40 text-xs uppercase font-heading tracking-wider">
                  <th className="text-left pb-2">Página</th>
                  <th className="text-right pb-2">Clicks</th>
                  <th className="text-right pb-2">Impr.</th>
                  <th className="text-right pb-2">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p: any, i: number) => {
                  const url = p.keys[0];
                  const path = url.replace(/^https?:\/\/[^/]+/, "") || "/";
                  return (
                    <tr key={i} className="border-t border-secondary-foreground/5">
                      <td className="py-2 text-secondary-foreground/80 truncate max-w-[220px]">
                        <a href={url} target="_blank" rel="noreferrer" className="hover:text-primary">
                          {path}
                        </a>
                      </td>
                      <td className="py-2 text-right text-secondary-foreground">{fmtNum(p.clicks)}</td>
                      <td className="py-2 text-right text-secondary-foreground/70">{fmtNum(p.impressions)}</td>
                      <td className={cn("py-2 text-right", positionTone(p.position))}>{p.position.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      <Section title="Cliques por Dispositivo">
        {devices.length === 0 ? (
          <p className="text-secondary-foreground/50 text-sm">Sem dados.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={devices.map((d: any) => ({ device: d.keys[0], clicks: d.clicks, ctr: d.ctr }))}>
              <CartesianGrid stroke="hsl(var(--secondary-foreground) / 0.08)" vertical={false} />
              <XAxis dataKey="device" stroke="hsl(var(--secondary-foreground) / 0.4)" fontSize={11} />
              <YAxis stroke="hsl(var(--secondary-foreground) / 0.4)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--secondary))",
                  border: "1px solid hsl(var(--secondary-foreground) / 0.2)",
                  borderRadius: 6,
                }}
              />
              <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                {devices.map((_: any, i: number) => (
                  <Cell key={i} fill="hsl(var(--primary))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Section>
    </div>
  );
};

// ---------- Page ----------
const AdminTrafego = () => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl uppercase text-secondary-foreground tracking-wider">
          Tráfego
        </h1>
        <p className="text-secondary-foreground/50 text-sm mt-1">
          Google Analytics 4 + Search Console em tempo real, segmentado pelo período global.
        </p>
      </div>

      <Tabs defaultValue="ga4">
        <TabsList className="bg-secondary-foreground/5 border border-secondary-foreground/10">
          <TabsTrigger value="ga4" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <BarChart3 size={14} /> Google Analytics
          </TabsTrigger>
          <TabsTrigger value="gsc" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
            <Search size={14} /> Search Console
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ga4" className="mt-6">
          <Ga4Tab />
        </TabsContent>
        <TabsContent value="gsc" className="mt-6">
          <GscTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTrafego;
