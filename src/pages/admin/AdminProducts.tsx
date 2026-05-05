import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pencil, Search, Eye, EyeOff, RefreshCw, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/database";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { getProductImageUrl } from "@/lib/image-utils";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<{ total: number; created: number; updated: number; at: Date } | null>(null);

  const handleSyncYampi = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-yampi");
      if (error) throw error;
      setLastSync({ total: data.total, created: data.created, updated: data.updated, at: new Date() });
      toast({
        title: "Sincronização concluída",
        description: `${data.total} produtos (${data.created} novos, ${data.updated} atualizados)`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (err: any) {
      toast({
        title: "Erro na sincronização",
        description: err.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:product_categories(*), images:product_images(*)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as (Product & { category: any; images: any[] })[];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("products").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const withoutYampi = products.filter((p) => !p.yampi_id).length;

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl uppercase text-secondary-foreground">Catálogo</h1>
          <p className="text-secondary-foreground/50 text-sm flex items-center gap-2">
            <Lock size={12} /> Cadastro 100% gerenciado pela Yampi · {products.length} produtos
          </p>
        </div>
        <Button
          variant="outline"
          className="font-heading uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10"
          onClick={handleSyncYampi}
          disabled={syncing}
        >
          <RefreshCw size={18} className={`mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Sincronizando..." : "Sincronizar Yampi"}
        </Button>
      </div>

      {/* Sync status */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-4">
          <div className="text-secondary-foreground/40 text-xs font-heading uppercase tracking-wider mb-1">
            Última sincronização
          </div>
          <div className="text-secondary-foreground text-sm flex items-center gap-2">
            {lastSync ? (
              <>
                <CheckCircle2 size={14} className="text-green-400" />
                {lastSync.at.toLocaleString("pt-BR")} · {lastSync.total} itens
              </>
            ) : (
              <span className="text-secondary-foreground/40">Nenhuma nesta sessão</span>
            )}
          </div>
        </Card>
        <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-4">
          <div className="text-secondary-foreground/40 text-xs font-heading uppercase tracking-wider mb-1">
            Produtos ativos
          </div>
          <div className="text-secondary-foreground text-2xl font-heading">
            {products.filter((p) => p.is_active).length}
          </div>
        </Card>
        <Card className="bg-secondary-foreground/5 border-secondary-foreground/10 p-4">
          <div className="text-secondary-foreground/40 text-xs font-heading uppercase tracking-wider mb-1 flex items-center gap-1">
            {withoutYampi > 0 && <AlertTriangle size={12} className="text-amber-400" />}
            Sem Yampi ID
          </div>
          <div className={`text-2xl font-heading ${withoutYampi > 0 ? "text-amber-400" : "text-secondary-foreground"}`}>
            {withoutYampi}
          </div>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/30" size={18} />
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
        />
      </div>

      {isLoading ? (
        <div className="text-secondary-foreground/50 text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-secondary-foreground/10 hover:bg-transparent">
                <TableHead className="text-secondary-foreground/50">Imagem</TableHead>
                <TableHead className="text-secondary-foreground/50">Nome</TableHead>
                <TableHead className="text-secondary-foreground/50">Categoria</TableHead>
                <TableHead className="text-secondary-foreground/50">Preço</TableHead>
                <TableHead className="text-secondary-foreground/50">Volume</TableHead>
                <TableHead className="text-secondary-foreground/50">Status</TableHead>
                <TableHead className="text-secondary-foreground/50 text-right">Editar SEO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id} className="border-secondary-foreground/10 hover:bg-secondary-foreground/5">
                  <TableCell>
                    {product.images?.[0] ? (
                      <img
                        src={getProductImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-secondary-foreground/10 flex items-center justify-center">
                        <span className="text-secondary-foreground/30 text-xs">N/A</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-secondary-foreground font-medium">
                    {product.name}
                    {product.badge && (
                      <Badge variant="secondary" className="ml-2 text-[10px] bg-primary/10 text-primary border-0">
                        {product.badge}
                      </Badge>
                    )}
                    {!product.yampi_id && (
                      <Badge variant="secondary" className="ml-2 text-[10px] bg-amber-500/10 text-amber-400 border-0">
                        Sem Yampi ID
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-secondary-foreground/60">{product.category?.name || "—"}</TableCell>
                  <TableCell className="text-secondary-foreground/60">
                    {product.price ? `R$ ${Number(product.price).toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-secondary-foreground/60">{product.volume || "—"}</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        toggleActive.mutate({ id: product.id, is_active: !product.is_active })
                      }
                      className="flex items-center gap-1.5"
                    >
                      {product.is_active ? (
                        <Badge className="bg-green-500/10 text-green-400 border-0 hover:bg-green-500/20">
                          <Eye size={12} className="mr-1" /> Ativo
                        </Badge>
                      ) : (
                        <Badge className="bg-secondary-foreground/10 text-secondary-foreground/40 border-0 hover:bg-secondary-foreground/20">
                          <EyeOff size={12} className="mr-1" /> Inativo
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-primary">
                      <Link to={`/admin/products/${product.id}`}>
                        <Pencil size={16} />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-secondary-foreground/40 py-12">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
