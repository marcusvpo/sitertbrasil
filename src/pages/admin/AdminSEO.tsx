import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, RefreshCw, ExternalLink, Pencil, Search } from "lucide-react";
import { clearSeoOverrideCache } from "@/hooks/useSeoOverride";

const KNOWN_ROUTES = [
  "/", "/motorex", "/seja-revendedor", "/quem-somos", "/parceiros",
  "/depoimentos", "/blog", "/central-atendimento",
  "/guia/qual-oleo-motocross-trilha-enduro", "/glossario", "/faq",
];

type Override = {
  id: string; route: string;
  title: string | null; description: string | null;
  og_image: string | null; keywords: string | null; noindex: boolean;
};

const GooglePreview = ({ title, description, route }: { title?: string; description?: string; route: string }) => (
  <div className="bg-white rounded-md p-4 border border-secondary-foreground/10 max-w-xl">
    <div className="text-xs text-gray-500 truncate">www.rtbrasilimport.com.br{route}</div>
    <div className="text-blue-700 text-lg leading-tight truncate">{title || "(sem title)"}</div>
    <div className="text-sm text-gray-700 line-clamp-2">{description || "(sem description)"}</div>
  </div>
);

const MetasTab = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Override | null>(null);
  const [form, setForm] = useState({
    route: "", title: "", description: "", og_image: "", keywords: "", noindex: false,
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["seo_overrides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_overrides").select("*").order("route");
      if (error) throw error;
      return data as Override[];
    },
  });

  const startEdit = (row: Override | null) => {
    setEditing(row);
    setForm({
      route: row?.route ?? "",
      title: row?.title ?? "",
      description: row?.description ?? "",
      og_image: row?.og_image ?? "",
      keywords: row?.keywords ?? "",
      noindex: row?.noindex ?? false,
    });
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        route: form.route.trim(),
        title: form.title || null,
        description: form.description || null,
        og_image: form.og_image || null,
        keywords: form.keywords || null,
        noindex: form.noindex,
        updated_at: new Date().toISOString(),
      };
      if (!payload.route.startsWith("/")) throw new Error("A rota deve começar com /");
      if (editing) {
        const { error } = await supabase.from("seo_overrides").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("seo_overrides").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      clearSeoOverrideCache();
      qc.invalidateQueries({ queryKey: ["seo_overrides"] });
      setOpen(false);
      toast({ title: "Meta salva" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_overrides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      clearSeoOverrideCache();
      qc.invalidateQueries({ queryKey: ["seo_overrides"] });
      toast({ title: "Removido" });
    },
  });

  const filtered = rows.filter((r) => r.route.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/30" size={16} />
          <Input className="pl-10 bg-secondary-foreground/5 border-secondary-foreground/20" placeholder="Filtrar rotas..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => startEdit(null)} className="font-heading uppercase tracking-wider">
          <Plus size={16} className="mr-2" /> Nova meta
        </Button>
      </div>

      <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-secondary-foreground/10 hover:bg-transparent">
              <TableHead className="text-secondary-foreground/50">Rota</TableHead>
              <TableHead className="text-secondary-foreground/50">Title</TableHead>
              <TableHead className="text-secondary-foreground/50">Description</TableHead>
              <TableHead className="text-secondary-foreground/50">Index</TableHead>
              <TableHead className="text-right text-secondary-foreground/50">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={5} className="text-center text-secondary-foreground/40 py-8">Carregando...</TableCell></TableRow>
            )}
            {!isLoading && filtered.map((r) => (
              <TableRow key={r.id} className="border-secondary-foreground/10 hover:bg-secondary-foreground/5">
                <TableCell className="font-mono text-secondary-foreground text-sm">{r.route}</TableCell>
                <TableCell className="text-secondary-foreground/70 max-w-xs truncate">{r.title || "—"}</TableCell>
                <TableCell className="text-secondary-foreground/60 max-w-md truncate text-sm">{r.description || "—"}</TableCell>
                <TableCell>
                  {r.noindex
                    ? <Badge className="bg-amber-500/10 text-amber-400 border-0">noindex</Badge>
                    : <Badge className="bg-green-500/10 text-green-400 border-0">index</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(r)}><Pencil size={14} /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(r.id)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-secondary-foreground/40 py-8">Nenhuma meta cadastrada.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase">{editing ? "Editar meta" : "Nova meta"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">Rota</label>
              <Input value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} placeholder="/exemplo" disabled={!!editing} list="known-routes" />
              <datalist id="known-routes">
                {KNOWN_ROUTES.map((r) => <option key={r} value={r} />)}
              </datalist>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">Title <span className="text-secondary-foreground/30">({form.title.length}/60)</span></label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={70} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">Description <span className="text-secondary-foreground/30">({form.description.length}/160)</span></label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={180} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">OG Image URL</label>
                <Input value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">Keywords</label>
                <Input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.noindex} onCheckedChange={(v) => setForm({ ...form, noindex: v })} />
              <span className="text-sm text-secondary-foreground/70">noindex,nofollow</span>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-secondary-foreground/50 mb-2 block">Preview Google</label>
              <GooglePreview title={form.title} description={form.description} route={form.route || "/"} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RedirectsTab = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["redirects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!from.startsWith("/") || !to.startsWith("/")) throw new Error("Use caminhos iniciando com /");
      const { error } = await supabase.from("redirects").insert({ from_path: from, to_path: to, is_active: true });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["redirects"] });
      setFrom(""); setTo("");
      toast({ title: "Redirect criado" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, v }: { id: string; v: boolean }) => {
      const { error } = await supabase.from("redirects").update({ is_active: v }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });

  return (
    <div className="space-y-4">
      <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-4">
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div>
            <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">De</label>
            <Input placeholder="/url-antiga" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-secondary-foreground/50">Para</label>
            <Input placeholder="/url-nova" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button onClick={() => add.mutate()} disabled={!from || !to || add.isPending}>
            <Plus size={16} className="mr-2" /> Adicionar
          </Button>
        </div>
      </Card>

      <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-secondary-foreground/10 hover:bg-transparent">
              <TableHead className="text-secondary-foreground/50">De</TableHead>
              <TableHead className="text-secondary-foreground/50">Para</TableHead>
              <TableHead className="text-secondary-foreground/50">Ativo</TableHead>
              <TableHead className="text-right text-secondary-foreground/50">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center py-8 text-secondary-foreground/40">Carregando...</TableCell></TableRow>}
            {!isLoading && rows.map((r) => (
              <TableRow key={r.id} className="border-secondary-foreground/10 hover:bg-secondary-foreground/5">
                <TableCell className="font-mono text-secondary-foreground text-sm">{r.from_path}</TableCell>
                <TableCell className="font-mono text-secondary-foreground/70 text-sm">→ {r.to_path}</TableCell>
                <TableCell><Switch checked={r.is_active} onCheckedChange={(v) => toggle.mutate({ id: r.id, v })} /></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(r.id)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && rows.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-secondary-foreground/40 py-8">Nenhum redirect cadastrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const AuditoriaTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [running, setRunning] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["seo_audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_audit_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as any[];
    },
  });

  // Latest by route
  const latest = useMemo(() => {
    const map = new Map<string, any>();
    for (const r of rows) if (!map.has(r.route)) map.set(r.route, r);
    return Array.from(map.values());
  }, [rows]);

  const runAudit = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("seo-audit");
      if (error) throw error;
      toast({ title: "Auditoria concluída", description: `${data.count} rotas avaliadas` });
      qc.invalidateQueries({ queryKey: ["seo_audit"] });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-green-400" : s >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-secondary-foreground/60 text-sm">
          Audita title, description, H1, canonical, OG, schema e mais para cada rota principal.
        </p>
        <Button onClick={runAudit} disabled={running}>
          <RefreshCw size={16} className={`mr-2 ${running ? "animate-spin" : ""}`} />
          {running ? "Auditando..." : "Rodar auditoria"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-secondary-foreground/40 py-8">Carregando...</div>
      ) : latest.length === 0 ? (
        <div className="text-center text-secondary-foreground/40 py-12 bg-secondary-foreground/5 rounded-lg border border-secondary-foreground/10">
          Nenhuma auditoria executada. Clique em "Rodar auditoria" acima.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {latest.map((r) => (
            <Card key={r.id} className="bg-secondary-foreground/5 border-secondary-foreground/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <a href={r.route} target="_blank" className="text-secondary-foreground font-mono text-sm hover:text-primary inline-flex items-center gap-1">
                  {r.route} <ExternalLink size={12} />
                </a>
                <div className={`font-heading text-2xl ${scoreColor(r.score)}`}>{r.score}</div>
              </div>
              <div className="text-xs text-secondary-foreground/40">
                {new Date(r.created_at).toLocaleString("pt-BR")}
              </div>
              <div className="space-y-1 pt-2 border-t border-secondary-foreground/10">
                {(r.checks || []).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <span className={c.ok ? "text-secondary-foreground/70" : "text-red-400"}>
                      {c.ok ? "✓" : "✗"} {c.label}
                    </span>
                    {c.note && <span className="text-secondary-foreground/40">{c.note}</span>}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminSEO = () => {
  return (
    <div className="p-6 md:p-8 space-y-5">
      <div>
        <h1 className="font-heading text-2xl uppercase text-secondary-foreground">SEO Center</h1>
        <p className="text-secondary-foreground/50 text-sm">Metas por rota, redirects 301 e auditoria automática.</p>
      </div>

      <Tabs defaultValue="metas">
        <TabsList className="bg-secondary-foreground/5 border border-secondary-foreground/10">
          <TabsTrigger value="metas">Metas por rota</TabsTrigger>
          <TabsTrigger value="redirects">Redirects 301</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
        </TabsList>
        <TabsContent value="metas" className="mt-4"><MetasTab /></TabsContent>
        <TabsContent value="redirects" className="mt-4"><RedirectsTab /></TabsContent>
        <TabsContent value="auditoria" className="mt-4"><AuditoriaTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSEO;
