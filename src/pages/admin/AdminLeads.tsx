import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Download, MessageCircle, Mail, User, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable, closestCorners,
} from "@dnd-kit/core";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Lead = {
  id: string;
  source: "revendedor" | "contato" | "newsletter";
  nome: string;
  email: string;
  phone: string | null;
  extra: string | null;
  created_at: string;
  status: string;
  score: number;
};

const STATUSES = [
  { id: "novo", label: "Novo", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
  { id: "contatado", label: "Contatado", color: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  { id: "qualificado", label: "Qualificado", color: "bg-purple-500/10 text-purple-300 border-purple-500/30" },
  { id: "convertido", label: "Convertido", color: "bg-green-500/10 text-green-300 border-green-500/30" },
  { id: "perdido", label: "Perdido", color: "bg-red-500/10 text-red-300 border-red-500/30" },
];

const SOURCE_BADGES: Record<string, string> = {
  revendedor: "bg-primary/10 text-primary",
  contato: "bg-cyan-500/10 text-cyan-300",
  newsletter: "bg-fuchsia-500/10 text-fuchsia-300",
};

const downloadCSV = (rows: Lead[]) => {
  const header = ["nome", "email", "telefone", "origem", "status", "criado_em"];
  const csv = [
    header,
    ...rows.map((r) => [
      r.nome, r.email, r.phone ?? "", r.source, r.status,
      new Date(r.created_at).toISOString(),
    ]),
  ]
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const LeadCard = ({ lead, onOpen }: { lead: Lead; onOpen: (l: Lead) => void }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `${lead.source}:${lead.id}` });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(lead)}
      className={`bg-secondary border border-secondary-foreground/10 rounded-md p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-secondary-foreground text-sm font-medium truncate flex-1">{lead.nome}</p>
        <Badge className={`text-[9px] uppercase border-0 ${SOURCE_BADGES[lead.source]}`}>
          {lead.source}
        </Badge>
      </div>
      <p className="text-secondary-foreground/40 text-xs truncate">{lead.email}</p>
      {lead.phone && <p className="text-secondary-foreground/40 text-xs truncate">{lead.phone}</p>}
      <p className="text-secondary-foreground/30 text-[10px] mt-2">
        {format(new Date(lead.created_at), "dd/MM HH:mm", { locale: ptBR })}
      </p>
    </div>
  );
};

const Column = ({
  status, leads, onOpen,
}: { status: typeof STATUSES[0]; leads: Lead[]; onOpen: (l: Lead) => void }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] bg-secondary-foreground/[0.03] border rounded-lg p-3 transition-colors ${
        isOver ? "border-primary/50 bg-primary/5" : "border-secondary-foreground/10"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-heading uppercase tracking-wider px-2 py-1 rounded border ${status.color}`}>
          {status.label}
        </span>
        <span className="text-secondary-foreground/40 text-xs">{leads.length}</span>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        {leads.map((l) => (
          <LeadCard key={`${l.source}-${l.id}`} lead={l} onOpen={onOpen} />
        ))}
        {leads.length === 0 && (
          <p className="text-secondary-foreground/30 text-xs text-center py-8">vazio</p>
        )}
      </div>
    </div>
  );
};

const AdminLeads = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const { data: leads = [] } = useQuery({
    queryKey: ["leads-unified"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads_unified" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Lead[];
    },
  });

  // Realtime: refresh on new submissions
  useEffect(() => {
    const ch = supabase
      .channel("leads-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "revendedor_submissions" }, () =>
        qc.invalidateQueries({ queryKey: ["leads-unified"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "contato_submissions" }, () =>
        qc.invalidateQueries({ queryKey: ["leads-unified"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "newsletter_submissions" }, () =>
        qc.invalidateQueries({ queryKey: ["leads-unified"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "lead_status" }, () =>
        qc.invalidateQueries({ queryKey: ["leads-unified"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const updateStatus = useMutation({
    mutationFn: async ({ source, source_id, status }: { source: string; source_id: string; status: string }) => {
      const { error } = await supabase
        .from("lead_status")
        .upsert({ source, source_id, status, updated_at: new Date().toISOString() }, { onConflict: "source,source_id" });
      if (error) throw error;
      await supabase.from("lead_events").insert({
        source, source_id, event_type: "status_change", payload: { to: status },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads-unified"] }),
  });

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filterSource !== "all" && l.source !== filterSource) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.nome?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q)
      );
    });
  }, [leads, filterSource, search]);

  const grouped = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    STATUSES.forEach((s) => (map[s.id] = []));
    filtered.forEach((l) => {
      const st = STATUSES.find((s) => s.id === l.status) ? l.status : "novo";
      map[st].push(l);
    });
    return map;
  }, [filtered]);

  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    const overId = e.over?.id as string | undefined;
    if (!overId) return;
    const [source, source_id] = String(e.active.id).split(":");
    if (!STATUSES.find((s) => s.id === overId)) return;
    updateStatus.mutate({ source, source_id, status: overId });
  };

  const draggingLead = draggingId
    ? leads.find((l) => `${l.source}:${l.id}` === draggingId)
    : null;

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl uppercase text-secondary-foreground">Leads · CRM</h1>
          <p className="text-secondary-foreground/50 text-sm">{filtered.length} leads · arraste para mudar status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => downloadCSV(filtered)} className="border-secondary-foreground/20">
            <Download size={16} className="mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/30" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome, email, telefone..."
            className="pl-10 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
          />
        </div>
        <div className="flex bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-md p-0.5">
          {["all", "revendedor", "contato", "newsletter"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSource(s)}
              className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wider rounded transition-colors ${
                filterSource === s
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground/60 hover:text-secondary-foreground"
              }`}
            >
              {s === "all" ? "Todos" : s}
            </button>
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e) => setDraggingId(String(e.active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDraggingId(null)}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STATUSES.map((s) => (
            <Column key={s.id} status={s} leads={grouped[s.id]} onOpen={setOpenLead} />
          ))}
        </div>
        <DragOverlay>
          {draggingLead && (
            <div className="bg-secondary border border-primary/50 rounded-md p-3 shadow-2xl rotate-2">
              <p className="text-secondary-foreground text-sm font-medium">{draggingLead.nome}</p>
              <p className="text-secondary-foreground/40 text-xs">{draggingLead.email}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <LeadDrawer
        lead={openLead}
        onClose={() => setOpenLead(null)}
        onStatusChange={(status) => {
          if (!openLead) return;
          updateStatus.mutate({ source: openLead.source, source_id: openLead.id, status });
          setOpenLead({ ...openLead, status });
          toast({ title: "Status atualizado" });
        }}
        userId={user?.id}
      />
    </div>
  );
};

const LeadDrawer = ({
  lead, onClose, onStatusChange, userId,
}: {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (s: string) => void;
  userId?: string;
}) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [note, setNote] = useState("");

  const { data: notes = [] } = useQuery({
    queryKey: ["lead-notes", lead?.source, lead?.id],
    queryFn: async () => {
      if (!lead) return [];
      const { data } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("source", lead.source)
        .eq("source_id", lead.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!lead,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["lead-events", lead?.source, lead?.id],
    queryFn: async () => {
      if (!lead) return [];
      const { data } = await supabase
        .from("lead_events")
        .select("*")
        .eq("source", lead.source)
        .eq("source_id", lead.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!lead,
  });

  const addNote = async () => {
    if (!lead || !note.trim()) return;
    const { error } = await supabase.from("lead_notes").insert({
      source: lead.source, source_id: lead.id, body: note.trim(), author_id: userId,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.from("lead_events").insert({
      source: lead.source, source_id: lead.id, event_type: "note_added",
    });
    setNote("");
    qc.invalidateQueries({ queryKey: ["lead-notes", lead.source, lead.id] });
    qc.invalidateQueries({ queryKey: ["lead-events", lead.source, lead.id] });
  };

  if (!lead) return null;
  const wa = lead.phone?.replace(/\D/g, "");
  const waLink = wa ? `https://wa.me/${wa.length === 11 ? "55" + wa : wa}` : null;

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-secondary border-secondary-foreground/20 text-secondary-foreground w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-secondary-foreground font-heading uppercase">{lead.nome}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-5">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-secondary-foreground/70">
              <Mail size={14} /> {lead.email}
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2 text-secondary-foreground/70">
                <MessageCircle size={14} /> {lead.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-secondary-foreground/70">
              <Tag size={14} />
              <Badge className={`text-[9px] uppercase border-0 ${SOURCE_BADGES[lead.source]}`}>{lead.source}</Badge>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/70">
              <Calendar size={14} /> {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </div>
            {lead.extra && (
              <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded p-3 text-secondary-foreground/80 text-xs">
                {lead.extra}
              </div>
            )}
          </div>

          {/* Status pills */}
          <div>
            <p className="text-xs font-heading uppercase tracking-wider text-secondary-foreground/40 mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onStatusChange(s.id)}
                  className={`px-3 py-1 text-xs font-heading uppercase tracking-wider rounded border transition-colors ${
                    lead.status === s.id ? s.color : "border-secondary-foreground/10 text-secondary-foreground/40 hover:text-secondary-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2">
            {waLink && (
              <Button asChild variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                <a href={waLink} target="_blank" rel="noreferrer">
                  <MessageCircle size={14} className="mr-2" /> WhatsApp
                </a>
              </Button>
            )}
            <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <a href={`mailto:${lead.email}`}>
                <Mail size={14} className="mr-2" /> Email
              </a>
            </Button>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-heading uppercase tracking-wider text-secondary-foreground/40 mb-2">Anotações</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Adicionar nota..."
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
            />
            <Button onClick={addNote} disabled={!note.trim()} size="sm" className="mt-2 font-heading uppercase tracking-wider">
              Adicionar
            </Button>
            <div className="space-y-2 mt-3">
              {notes.map((n: any) => (
                <div key={n.id} className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded p-3 text-sm">
                  <p className="text-secondary-foreground/80">{n.body}</p>
                  <p className="text-secondary-foreground/30 text-xs mt-1">
                    {format(new Date(n.created_at), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-heading uppercase tracking-wider text-secondary-foreground/40 mb-2">Timeline</p>
            <div className="space-y-1.5">
              {events.map((e: any) => (
                <div key={e.id} className="flex items-center gap-2 text-xs text-secondary-foreground/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="font-mono">{e.event_type}</span>
                  {e.payload?.to && <span className="text-primary">→ {e.payload.to}</span>}
                  <span className="ml-auto text-secondary-foreground/30">
                    {format(new Date(e.created_at), "dd/MM HH:mm", { locale: ptBR })}
                  </span>
                </div>
              ))}
              {events.length === 0 && <p className="text-secondary-foreground/30 text-xs">sem eventos</p>}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminLeads;
