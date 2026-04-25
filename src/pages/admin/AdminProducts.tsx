import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/database";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

import { getProductImageUrl } from "@/lib/image-utils";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSyncYampi = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-yampi");
      if (error) throw error;
      toast({
        title: "Sincronização concluída",
        description: `${data.total} produtos processados (${data.created} novos, ${data.updated} atualizados)`,
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const product = products.find((p) => p.id === id);
      if (product?.images?.length) {
        const paths = product.images.map((img: any) => img.storage_path);
        await supabase.storage.from("products").remove(paths);
      }
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteId(null);
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


  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl uppercase text-secondary-foreground">Produtos</h1>
          <p className="text-secondary-foreground/50 text-sm">{products.length} produtos cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="font-heading uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10"
            onClick={handleSyncYampi}
            disabled={syncing}
          >
            <RefreshCw size={18} className={`mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizando..." : "Sincronizar Yampi"}
          </Button>
          <Button asChild className="font-heading uppercase tracking-wider">
            <Link to="/admin/products/new">
              <Plus size={18} className="mr-2" /> Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
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
                <TableHead className="text-secondary-foreground/50 text-right">Ações</TableHead>
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
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-primary">
                        <Link to={`/admin/products/${product.id}`}>
                          <Pencil size={16} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-secondary-foreground/60 hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
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

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-secondary border-secondary-foreground/20">
          <DialogHeader>
            <DialogTitle className="text-secondary-foreground">Excluir produto</DialogTitle>
            <DialogDescription className="text-secondary-foreground/50">
              Tem certeza? Esta ação não pode ser desfeita. As imagens do produto também serão removidas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-secondary-foreground/20 text-secondary-foreground">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
