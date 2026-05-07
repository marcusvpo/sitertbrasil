import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Users, Smartphone, Monitor, Tablet, Eye, MousePointerClick, ShoppingCart, CreditCard, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface LiveSession {
  session_id: string;
  current_path: string | null;
  device: string | null;
  referrer: string | null;
  utm_source: string | null;
  last_seen: string;
  started_at: string;
}

interface FunnelEvent {
  id: number;
  session_id: string;
  event_type: string;
  path: string | null;
  product_id: string | null;
  device: string | null;
  metadata: any;
  created_at: string;
}

const ACTIVE_WINDOW_MS = 90_000; // sessões ativas nos últimos 90s

const eventMeta: Record<string, { icon: any; label: string; tone: string }> = {
  pageview: { icon: Eye, label: "Pageview", tone: "text-secondary-foreground/60" },
  view_product: { icon: MousePointerClick, label: "Viu produto", tone: "text-primary" },
  add_to_cart: { icon: ShoppingCart, label: "Add ao carrinho", tone: "text-amber-400" },
  begin_checkout: { icon: CreditCard, label: "Iniciou checkout", tone: "text-green-400" },
  lead: { icon: UserPlus, label: "Lead gerado", tone: "text-fuchsia-400" },
  custom: { icon: Activity, label: "Evento", tone: "text-secondary-foreground/60" },
};

const DeviceIcon = ({ device }: { device: string | null }) => {
  const Icon = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : Monitor;
  return <Icon size={12} />;
};

const AdminRealtime = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // ticker para atualizar "ativos nos últimos X segundos"
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  // Carga inicial
  useEffect(() => {
    let cancel = false;
    (async () => {
      const since = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString();
      const [s, e] = await Promise.all([
        supabase.from("live_sessions").select("*").gte("last_seen", since).order("last_seen", { ascending: false }),
        supabase.from("funnel_events").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      if (cancel) return;
      setSessions((s.data as any) || []);
      setEvents((e.data as any) || []);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    const ch = supabase
      .channel("realtime-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_sessions" }, (payload: any) => {
        setSessions((prev) => {
          const next = prev.filter((s) => s.session_id !== payload.new?.session_id && s.session_id !== payload.old?.session_id);
          if (payload.new) next.unshift(payload.new);
          return next.slice(0, 200);
        });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "funnel_events" }, (payload: any) => {
        setEvents((prev) => [payload.new, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  const activeSessions = useMemo(
    () => sessions.filter((s) => now - new Date(s.last_seen).getTime() < ACTIVE_WINDOW_MS),
    [sessions, now],
  );

  const byDevice = useMemo(() => {
    const acc: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    activeSessions.forEach((s) => { acc[s.device || "desktop"] = (acc[s.device || "desktop"] || 0) + 1; });
    return acc;
  }, [activeSessions]);

  const byPath = useMemo(() => {
    const acc: Record<string, number> = {};
    activeSessions.forEach((s) => {
      const p = s.current_path || "/";
      acc[p] = (acc[p] || 0) + 1;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [activeSessions]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl uppercase text-secondary-foreground tracking-wider flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            Tempo Real
          </h1>
          <p className="text-secondary-foreground/50 text-sm mt-1">
            Visitantes ativos agora e eventos do funil ao vivo (window de 90s).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary-foreground/5 border border-primary/30 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-secondary-foreground/60 text-xs font-heading uppercase tracking-wider">
                    Usuários Agora
                  </span>
                  <Users size={16} className="text-primary" />
                </div>
                <div className="text-secondary-foreground text-4xl font-heading">{activeSessions.length}</div>
              </div>
            </div>
            {(["desktop", "mobile", "tablet"] as const).map((d) => {
              const Icon = d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;
              return (
                <div key={d} className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider capitalize">{d}</span>
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div className="text-secondary-foreground text-2xl font-heading">{byDevice[d] || 0}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top paths */}
            <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg">
              <div className="px-5 py-3 border-b border-secondary-foreground/10">
                <h3 className="font-heading uppercase tracking-wider text-secondary-foreground text-sm">
                  Páginas Sendo Vistas
                </h3>
              </div>
              <div className="p-5">
                {byPath.length === 0 ? (
                  <p className="text-secondary-foreground/50 text-sm">Nenhum visitante ativo no momento.</p>
                ) : (
                  <ul className="space-y-2">
                    {byPath.map(([p, c]) => {
                      const max = byPath[0][1];
                      const pct = (c / max) * 100;
                      return (
                        <li key={p} className="flex items-center gap-3">
                          <span className="text-secondary-foreground/80 text-sm flex-1 truncate">{p}</span>
                          <span className="text-secondary-foreground font-heading text-sm">{c}</span>
                          <div className="w-24 h-1.5 bg-secondary-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Live event feed */}
            <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg">
              <div className="px-5 py-3 border-b border-secondary-foreground/10 flex items-center justify-between">
                <h3 className="font-heading uppercase tracking-wider text-secondary-foreground text-sm">
                  Eventos ao Vivo
                </h3>
                <span className="text-secondary-foreground/40 text-xs">{events.length} recentes</span>
              </div>
              <div className="p-5 max-h-[480px] overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-secondary-foreground/50 text-sm">Nenhum evento ainda.</p>
                ) : (
                  <ul className="space-y-2">
                    {events.map((ev) => {
                      const meta = eventMeta[ev.event_type] || eventMeta.custom;
                      const Icon = meta.icon;
                      const name = ev.metadata?.name;
                      return (
                        <li key={ev.id} className="flex items-start gap-3 py-2 border-b border-secondary-foreground/5 last:border-0">
                          <Icon size={14} className={cn("mt-0.5 shrink-0", meta.tone)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm">
                              <span className={cn("font-heading uppercase text-xs tracking-wider", meta.tone)}>
                                {meta.label}
                              </span>
                              <DeviceIcon device={ev.device} />
                            </div>
                            <div className="text-secondary-foreground/70 text-xs truncate">
                              {name ? `${name} · ` : ""}{ev.path || "/"}
                            </div>
                          </div>
                          <span className="text-secondary-foreground/40 text-xs shrink-0">
                            {formatDistanceToNow(new Date(ev.created_at), { locale: ptBR, addSuffix: false })}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Active sessions table */}
          <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg">
            <div className="px-5 py-3 border-b border-secondary-foreground/10">
              <h3 className="font-heading uppercase tracking-wider text-secondary-foreground text-sm">
                Sessões Ativas
              </h3>
            </div>
            <div className="p-5 overflow-x-auto">
              {activeSessions.length === 0 ? (
                <p className="text-secondary-foreground/50 text-sm">Nenhuma sessão ativa.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-secondary-foreground/40 text-xs uppercase font-heading tracking-wider">
                      <th className="text-left pb-2">Sessão</th>
                      <th className="text-left pb-2">Página atual</th>
                      <th className="text-left pb-2">Dispositivo</th>
                      <th className="text-left pb-2">Origem</th>
                      <th className="text-right pb-2">Ativa há</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((s) => (
                      <tr key={s.session_id} className="border-t border-secondary-foreground/5">
                        <td className="py-2 text-secondary-foreground/60 font-mono text-xs">
                          {s.session_id.slice(2, 12)}
                        </td>
                        <td className="py-2 text-secondary-foreground/80 truncate max-w-[260px]">
                          {s.current_path || "/"}
                        </td>
                        <td className="py-2 text-secondary-foreground/70 capitalize flex items-center gap-2">
                          <DeviceIcon device={s.device} /> {s.device || "?"}
                        </td>
                        <td className="py-2 text-secondary-foreground/60 truncate max-w-[200px]">
                          {s.utm_source || (s.referrer ? new URL(s.referrer).hostname : "Direto")}
                        </td>
                        <td className="py-2 text-right text-secondary-foreground/60">
                          {formatDistanceToNow(new Date(s.started_at), { locale: ptBR })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminRealtime;
