import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePeriod } from "@/contexts/PeriodContext";
import { Card } from "@/components/ui/card";
import {
  Users, Mail, Briefcase, TrendingUp, Package, Activity,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { format, eachDayOfInterval, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

const KPI = ({
  icon: Icon, label, value, hint, accent = false,
}: { icon: any; label: string; value: string | number; hint?: string; accent?: boolean }) => (
  <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider">{label}</span>
      <Icon size={16} className={accent ? "text-primary" : "text-secondary-foreground/40"} />
    </div>
    <div className={`text-3xl font-heading ${accent ? "text-primary" : "text-secondary-foreground"}`}>{value}</div>
    {hint && <div className="text-xs text-secondary-foreground/40 mt-1">{hint}</div>}
  </Card>
);

const AdminDashboard = () => {
  const { from, to, label } = usePeriod();
  const [liveLeads, setLiveLeads] = useState<any[]>([]);

  const fromIso = from.toISOString();
  const toIso = to.toISOString();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dash-stats", fromIso, toIso],
    queryFn: async () => {
      const [rev, ct, nl, prod] = await Promise.all([
        supabase.from("revendedor_submissions").select("id, created_at").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("contato_submissions").select("id, created_at").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("newsletter_submissions").select("id, created_at").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      return {
        revendedor: rev.data ?? [],
        contato: ct.data ?? [],
        newsletter: nl.data ?? [],
        productsActive: prod.count ?? 0,
      };
    },
  });

  const { data: recentLeads } = useQuery({
    queryKey: ["recent-leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads_unified" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
    refetchInterval: 30_000,
  });

  // Realtime feed
  useEffect(() => {
    const channel = supabase
      .channel("dash-live-leads")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "revendedor_submissions" }, (p) =>
        setLiveLeads((s) => [{ ...p.new, source: "revendedor" }, ...s].slice(0, 5))
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contato_submissions" }, (p) =>
        setLiveLeads((s) => [{ ...p.new, source: "contato" }, ...s].slice(0, 5))
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "newsletter_submissions" }, (p) =>
        setLiveLeads((s) => [{ ...p.new, source: "newsletter" }, ...s].slice(0, 5))
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Build chart series
  const all = [
    ...(stats?.revendedor ?? []).map((x) => ({ ...x, t: "Revendedor" })),
    ...(stats?.contato ?? []).map((x) => ({ ...x, t: "Contato" })),
    ...(stats?.newsletter ?? []).map((x) => ({ ...x, t: "Newsletter" })),
  ];
  const days = eachDayOfInterval({ start: from, end: to });
  const series = days.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    const count = all.filter((x: any) => format(new Date(x.created_at), "yyyy-MM-dd") === key).length;
    return { date: format(d, "dd/MM", { locale: ptBR }), leads: count };
  });

  const totalLeads = (stats?.revendedor.length ?? 0) + (stats?.contato.length ?? 0) + (stats?.newsletter.length ?? 0);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl uppercase text-secondary-foreground">Visão Geral</h1>
        <p className="text-secondary-foreground/50 text-sm">{label} · dados em tempo real</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPI icon={TrendingUp} label="Leads Totais" value={isLoading ? "—" : totalLeads} accent />
        <KPI icon={Briefcase} label="Revendedores" value={stats?.revendedor.length ?? 0} />
        <KPI icon={Mail} label="Contato" value={stats?.contato.length ?? 0} />
        <KPI icon={Users} label="Newsletter" value={stats?.newsletter.length ?? 0} />
        <KPI icon={Package} label="Produtos Ativos" value={stats?.productsActive ?? 0} />
        <KPI icon={Activity} label="Eventos Live" value={liveLeads.length} hint="últimos 5 min" />
      </div>

      <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-5">
        <h2 className="font-heading uppercase text-sm tracking-wider text-secondary-foreground mb-4">
          Leads por dia
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary-foreground)/0.1)" />
              <XAxis dataKey="date" stroke="hsl(var(--secondary-foreground)/0.4)" fontSize={11} />
              <YAxis stroke="hsl(var(--secondary-foreground)/0.4)" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--secondary))",
                  border: "1px solid hsl(var(--secondary-foreground)/0.2)",
                  borderRadius: 6,
                }}
              />
              <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" fill="url(#g)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading uppercase text-sm tracking-wider text-secondary-foreground">
              Leads recentes
            </h2>
            <Link to="/admin/leads" className="text-primary text-xs uppercase font-heading tracking-wider hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="space-y-2">
            {(recentLeads ?? []).map((l: any) => (
              <div key={`${l.source}-${l.id}`} className="flex items-center justify-between py-2 border-b border-secondary-foreground/5 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="text-secondary-foreground text-sm truncate">{l.nome}</div>
                  <div className="text-secondary-foreground/40 text-xs">{l.email}</div>
                </div>
                <span className="text-[10px] uppercase font-heading tracking-wider px-2 py-1 rounded bg-primary/10 text-primary">
                  {l.source}
                </span>
              </div>
            ))}
            {(recentLeads ?? []).length === 0 && (
              <p className="text-secondary-foreground/40 text-sm text-center py-6">Sem leads ainda.</p>
            )}
          </div>
        </Card>

        <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-5">
          <h2 className="font-heading uppercase text-sm tracking-wider text-secondary-foreground mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            Tempo Real
          </h2>
          <div className="space-y-2">
            {liveLeads.length === 0 ? (
              <p className="text-secondary-foreground/40 text-sm text-center py-6">
                Aguardando novos eventos…
              </p>
            ) : (
              liveLeads.map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-secondary-foreground">{l.nome ?? l.email}</span>
                  <span className="text-secondary-foreground/40 text-xs ml-auto uppercase">{l.source}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
