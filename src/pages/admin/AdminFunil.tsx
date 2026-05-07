import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePeriod } from "@/contexts/PeriodContext";
import { Filter, Eye, MousePointerClick, ShoppingCart, CreditCard, UserPlus, ArrowDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "pageview", label: "Visitantes", icon: Eye, tone: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
  { key: "view_product", label: "Viu Produto", icon: MousePointerClick, tone: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/30" },
  { key: "add_to_cart", label: "Add ao Carrinho", icon: ShoppingCart, tone: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30" },
  { key: "begin_checkout", label: "Iniciou Checkout", icon: CreditCard, tone: "from-green-500/20 to-green-500/5", border: "border-green-500/30" },
  { key: "lead", label: "Lead", icon: UserPlus, tone: "from-fuchsia-500/20 to-fuchsia-500/5", border: "border-fuchsia-500/30" },
] as const;

type SegmentKey = "all" | "device" | "utm_source";

interface EventRow {
  session_id: string;
  event_type: string;
  device: string | null;
  utm_source: string | null;
  created_at: string;
}

const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n);
const pct = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toFixed(1)}%` : "—");

const AdminFunil = () => {
  const { from, to } = usePeriod();
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [seg, setSeg] = useState<SegmentKey>("all");

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    (async () => {
      // pegamos só os event_types do funil
      const { data, error } = await supabase
        .from("funnel_events")
        .select("session_id, event_type, device, utm_source, created_at")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())
        .in("event_type", STAGES.map((s) => s.key))
        .limit(50000);
      if (cancel) return;
      if (error) console.error(error);
      setRows((data as EventRow[]) || []);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [from, to]);

  // sessões únicas por estágio (sessão única que atingiu pelo menos esse estágio)
  const buildFunnel = (subset: EventRow[]) => {
    return STAGES.map((s) => {
      const set = new Set<string>();
      subset.forEach((r) => { if (r.event_type === s.key) set.add(r.session_id); });
      return { ...s, count: set.size };
    });
  };

  const overall = useMemo(() => buildFunnel(rows), [rows]);
  const topStage = overall[0]?.count || 0;

  // Segmentação
  const segments = useMemo(() => {
    if (seg === "all") return null;
    const groups = new Map<string, EventRow[]>();
    rows.forEach((r) => {
      const key = (seg === "device" ? r.device : r.utm_source) || "(direto)";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    });
    return Array.from(groups.entries())
      .map(([key, list]) => ({ key, funnel: buildFunnel(list) }))
      .sort((a, b) => (b.funnel[0]?.count || 0) - (a.funnel[0]?.count || 0))
      .slice(0, 8);
  }, [rows, seg]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl uppercase text-secondary-foreground tracking-wider flex items-center gap-3">
          <Filter size={24} className="text-primary" />
          Funil de Conversão
        </h1>
        <p className="text-secondary-foreground/50 text-sm mt-1">
          Sessões únicas que atingiram cada estágio. Drop-off calculado entre etapas consecutivas.
        </p>
      </div>

      <Tabs value={seg} onValueChange={(v) => setSeg(v as SegmentKey)}>
        <TabsList className="bg-secondary-foreground/5 border border-secondary-foreground/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Geral</TabsTrigger>
          <TabsTrigger value="device" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Por Dispositivo</TabsTrigger>
          <TabsTrigger value="utm_source" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Por Fonte (UTM)</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-10 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            Nenhum evento registrado no período. O tracking começa a popular dados conforme visitantes navegam pelo site.
          </p>
        </div>
      ) : seg === "all" ? (
        <FunnelView funnel={overall} max={topStage} />
      ) : (
        <div className="space-y-6">
          {segments!.map((s) => (
            <div key={s.key} className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-5">
              <h3 className="font-heading uppercase text-secondary-foreground text-sm tracking-wider mb-4">
                {s.key} <span className="text-secondary-foreground/40 ml-2">{fmt(s.funnel[0].count)} visitantes</span>
              </h3>
              <FunnelView funnel={s.funnel} max={s.funnel[0].count} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FunnelView = ({
  funnel, max, compact = false,
}: {
  funnel: ReturnType<typeof STAGES["map"] extends never ? never : any>;
  max: number;
  compact?: boolean;
}) => {
  return (
    <div className={cn("space-y-3", !compact && "max-w-3xl")}>
      {funnel.map((s: any, i: number) => {
        const widthPct = max > 0 ? (s.count / max) * 100 : 0;
        const prev = i > 0 ? funnel[i - 1].count : null;
        const dropoff = prev !== null && prev > 0 ? ((prev - s.count) / prev) * 100 : null;
        const conv = prev !== null ? pct(s.count, prev) : null;
        const Icon = s.icon;

        return (
          <div key={s.key}>
            {i > 0 && (
              <div className="flex items-center justify-center gap-2 my-1 text-xs">
                <ArrowDown size={12} className="text-secondary-foreground/30" />
                <span className="text-secondary-foreground/40">
                  Conversão: <span className="text-primary">{conv}</span>
                </span>
                {dropoff !== null && dropoff > 0 && (
                  <span className="text-secondary-foreground/40">
                    · Drop-off: <span className="text-destructive">{dropoff.toFixed(1)}%</span>
                  </span>
                )}
              </div>
            )}
            <div className={cn("relative rounded-lg border bg-gradient-to-r p-4 flex items-center gap-4", s.tone, s.border)}>
              <div
                className="absolute inset-y-0 left-0 bg-primary/5 rounded-lg pointer-events-none"
                style={{ width: `${widthPct}%` }}
              />
              <div className="relative flex items-center gap-3 flex-1">
                <Icon size={18} className="text-secondary-foreground/80" />
                <span className="font-heading uppercase tracking-wider text-secondary-foreground text-sm">
                  {s.label}
                </span>
              </div>
              <div className="relative text-right">
                <div className="text-secondary-foreground font-heading text-2xl">{fmt(s.count)}</div>
                <div className="text-secondary-foreground/40 text-xs">
                  {max > 0 ? `${((s.count / max) * 100).toFixed(1)}% do topo` : ""}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminFunil;
