import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Search, Download, Mail, Users, MessageSquare, Eye } from "lucide-react";
import type {
  RevendedorSubmission,
  ContatoSubmission,
  NewsletterSubmission,
} from "@/types/database";

const PAGE_SIZE = 20;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const StatCard = ({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number;
  icon: any;
  loading: boolean;
}) => (
  <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-4 flex items-center gap-4">
    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-secondary-foreground/50 font-heading">
        {label}
      </p>
      <p className="text-2xl font-bold text-secondary-foreground">
        {loading ? "—" : value}
      </p>
    </div>
  </div>
);

const AdminLeads = () => {
  const qc = useQueryClient();

  const revendedoresQ = useQuery({
    queryKey: ["leads-revendedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revendedor_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as RevendedorSubmission[];
    },
  });

  const contatosQ = useQuery({
    queryKey: ["leads-contatos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contato_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContatoSubmission[];
    },
  });

  const newsletterQ = useQuery({
    queryKey: ["leads-newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as NewsletterSubmission[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      table,
      id,
      status,
    }: {
      table: "revendedor_submissions" | "contato_submissions" | "newsletter_submissions";
      id: string;
      status: string;
    }) => {
      const { error } = await supabase.from(table).update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      const key =
        vars.table === "revendedor_submissions"
          ? "leads-revendedores"
          : vars.table === "contato_submissions"
            ? "leads-contatos"
            : "leads-newsletter";
      qc.invalidateQueries({ queryKey: [key] });
    },
  });

  const totalRev = revendedoresQ.data?.length ?? 0;
  const totalCon = contatosQ.data?.length ?? 0;
  const totalNews = newsletterQ.data?.length ?? 0;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-3xl font-heading uppercase tracking-wider text-secondary-foreground">
          Leads & Cadastros
        </h1>
        <p className="text-secondary-foreground/50 text-sm mt-1">
          Acompanhe todos os formulários preenchidos no site.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Revendedores"
          value={totalRev}
          icon={Users}
          loading={revendedoresQ.isLoading}
        />
        <StatCard
          label="Fale Conosco"
          value={totalCon}
          icon={MessageSquare}
          loading={contatosQ.isLoading}
        />
        <StatCard
          label="Newsletter"
          value={totalNews}
          icon={Mail}
          loading={newsletterQ.isLoading}
        />
      </div>

      <Tabs defaultValue="revendedores" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="revendedores">Revendedores</TabsTrigger>
          <TabsTrigger value="contatos">Fale Conosco</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        </TabsList>

        <TabsContent value="revendedores" className="mt-6">
          <RevendedoresTab
            data={revendedoresQ.data ?? []}
            loading={revendedoresQ.isLoading}
            onStatusChange={(id, status) =>
              updateStatus.mutate({ table: "revendedor_submissions", id, status })
            }
          />
        </TabsContent>

        <TabsContent value="contatos" className="mt-6">
          <ContatosTab
            data={contatosQ.data ?? []}
            loading={contatosQ.isLoading}
            onStatusChange={(id, status) =>
              updateStatus.mutate({ table: "contato_submissions", id, status })
            }
          />
        </TabsContent>

        <TabsContent value="newsletter" className="mt-6">
          <NewsletterTab
            data={newsletterQ.data ?? []}
            loading={newsletterQ.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ---------------- Revendedores ----------------

const REV_STATUSES = ["novo", "contatado", "convertido", "descartado"];

const RevendedoresTab = ({
  data,
  loading,
  onStatusChange,
}: {
  data: RevendedorSubmission[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      data.filter((r) => {
        const matchesSearch =
          !search ||
          r.nome.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          (r.empresa ?? "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [data, search, statusFilter]
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/40"
            size={16}
          />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-secondary-foreground/5"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] bg-secondary-foreground/5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {REV_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-secondary-foreground/[0.03] border border-secondary-foreground/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-secondary-foreground/10">
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-secondary-foreground/50">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-secondary-foreground/50">
                  Nenhum cadastro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((r) => (
                <TableRow key={r.id} className="border-secondary-foreground/10">
                  <TableCell className="font-medium">{r.nome}</TableCell>
                  <TableCell>{r.empresa || "—"}</TableCell>
                  <TableCell>
                    <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                      {r.email}
                    </a>
                  </TableCell>
                  <TableCell>{r.whatsapp || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      onValueChange={(v) => onStatusChange(r.id, v)}
                    >
                      <SelectTrigger className="w-[140px] h-8 bg-secondary-foreground/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REV_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-secondary-foreground/60 text-xs">
                    {formatDate(r.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
    </div>
  );
};

// ---------------- Contatos ----------------

const CON_STATUSES = ["novo", "respondido", "arquivado"];

const ContatosTab = ({
  data,
  loading,
  onStatusChange,
}: {
  data: ContatoSubmission[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<ContatoSubmission | null>(null);

  const filtered = useMemo(
    () =>
      data.filter((c) => {
        const matchesSearch =
          !search ||
          c.nome.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [data, search, statusFilter]
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/40"
            size={16}
          />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-secondary-foreground/5"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] bg-secondary-foreground/5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {CON_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-secondary-foreground/[0.03] border border-secondary-foreground/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-secondary-foreground/10">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-secondary-foreground/50">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-secondary-foreground/50">
                  Nenhum cadastro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((c) => (
                <TableRow key={c.id} className="border-secondary-foreground/10">
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell>
                    <a href={`mailto:${c.email}`} className="text-primary hover:underline">
                      {c.email}
                    </a>
                  </TableCell>
                  <TableCell>{c.whatsapp || "—"}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <button
                      onClick={() => setViewing(c)}
                      className="text-left flex items-center gap-2 group"
                    >
                      <span className="truncate text-secondary-foreground/80 group-hover:text-secondary-foreground">
                        {c.mensagem.length > 60 ? c.mensagem.slice(0, 60) + "..." : c.mensagem}
                      </span>
                      <Eye size={14} className="text-secondary-foreground/40 shrink-0" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v) => onStatusChange(c.id, v)}>
                      <SelectTrigger className="w-[140px] h-8 bg-secondary-foreground/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CON_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-secondary-foreground/60 text-xs">
                    {formatDate(c.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mensagem de {viewing?.nome}</DialogTitle>
            <DialogDescription>
              {viewing?.email} {viewing?.whatsapp ? `• ${viewing.whatsapp}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
            {viewing?.mensagem}
          </div>
          <p className="text-xs text-muted-foreground">
            Enviado em {viewing && formatDate(viewing.created_at)}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ---------------- Newsletter ----------------

const NewsletterTab = ({
  data,
  loading,
}: {
  data: NewsletterSubmission[];
  loading: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      data.filter(
        (n) =>
          !search ||
          n.nome.toLowerCase().includes(search.toLowerCase()) ||
          n.email.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const exportCSV = () => {
    // Substack-compatible: email, first_name
    const rows = [
      ["email", "first_name"],
      ...filtered.map((n) => [n.email, n.nome.split(" ")[0]]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-substack-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/40"
            size={16}
          />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-secondary-foreground/5"
          />
        </div>
        <Button onClick={exportCSV} variant="outline" disabled={filtered.length === 0}>
          <Download size={16} />
          Exportar CSV (Substack)
        </Button>
      </div>

      <div className="bg-secondary-foreground/[0.03] border border-secondary-foreground/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-secondary-foreground/10">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cupom Enviado</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-secondary-foreground/50">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-secondary-foreground/50">
                  Nenhum inscrito ainda.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((n) => (
                <TableRow key={n.id} className="border-secondary-foreground/10">
                  <TableCell className="font-medium">{n.nome}</TableCell>
                  <TableCell>
                    <a href={`mailto:${n.email}`} className="text-primary hover:underline">
                      {n.email}
                    </a>
                  </TableCell>
                  <TableCell>{n.telefone}</TableCell>
                  <TableCell>
                    {n.cupom_enviado ? (
                      <Badge variant="default" className="bg-green-600/20 text-green-500 hover:bg-green-600/20">
                        ✓ Enviado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-secondary-foreground/60 text-xs">
                    {formatDate(n.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} total={filtered.length} />
    </div>
  );
};

// ---------------- Pagination ----------------

const Pagination = ({
  page,
  totalPages,
  setPage,
  total,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  total: number;
}) => (
  <div className="flex items-center justify-between text-sm text-secondary-foreground/60">
    <span>{total} registro(s)</span>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Anterior
      </Button>
      <span>
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Próxima
      </Button>
    </div>
  </div>
);

export default AdminLeads;
