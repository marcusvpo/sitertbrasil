import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Star, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProductImageUrl } from "@/lib/image-utils";
import { useState } from "react";
import type { Product, ProductCategory, ProductImage } from "@/types/database";

type ProductWithRelations = Product & { category: ProductCategory | null; images: ProductImage[] };

const AdminVitrine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:product_categories(*), images:product_images(*)")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ProductWithRelations[];
    },
  });

  const featuredProducts = allProducts
    .filter((p) => p.is_featured)
    .sort((a, b) => a.sort_order - b.sort_order);

  const availableProducts = allProducts.filter(
    (p) =>
      !p.is_featured &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from("products").update({ is_featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  const reorder = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      const idx = featuredProducts.findIndex((p) => p.id === id);
      if (idx < 0) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= featuredProducts.length) return;

      const current = featuredProducts[idx];
      const swap = featuredProducts[swapIdx];

      await Promise.all([
        supabase.from("products").update({ sort_order: swap.sort_order }).eq("id", current.id),
        supabase.from("products").update({ sort_order: current.sort_order }).eq("id", swap.id),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  const handleAdd = (product: ProductWithRelations) => {
    toggleFeatured.mutate({ id: product.id, is_featured: true });
    toast({ title: `"${product.name}" adicionado à vitrine` });
  };

  const handleRemove = (product: ProductWithRelations) => {
    toggleFeatured.mutate({ id: product.id, is_featured: false });
    toast({ title: `"${product.name}" removido da vitrine` });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-secondary-foreground/50 text-center py-12">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl uppercase text-secondary-foreground">Vitrine</h1>
        <p className="text-secondary-foreground/50 text-sm">
          Selecione e ordene os produtos que aparecem na seção "Produtos em Destaque" da Home.
        </p>
      </div>

      {/* Featured products */}
      <div className="mb-10">
        <h2 className="font-heading text-lg uppercase text-secondary-foreground mb-4 flex items-center gap-2">
          <Star size={18} className="text-primary" />
          Na Vitrine ({featuredProducts.length})
        </h2>

        {featuredProducts.length === 0 ? (
          <div className="border border-dashed border-secondary-foreground/20 rounded-lg p-8 text-center text-secondary-foreground/40">
            Nenhum produto na vitrine. Adicione produtos abaixo.
          </div>
        ) : (
          <div className="space-y-2">
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => reorder.mutate({ id: product.id, direction: "up" })}
                    disabled={idx === 0 || reorder.isPending}
                    className="text-secondary-foreground/40 hover:text-primary disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => reorder.mutate({ id: product.id, direction: "down" })}
                    disabled={idx === featuredProducts.length - 1 || reorder.isPending}
                    className="text-secondary-foreground/40 hover:text-primary disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

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

                <div className="flex-1 min-w-0">
                  <p className="text-secondary-foreground font-medium truncate">{product.name}</p>
                  <p className="text-secondary-foreground/50 text-xs">{product.category?.name || "Sem categoria"}</p>
                </div>

                {product.price && (
                  <span className="text-secondary-foreground/60 text-sm">
                    R$ {Number(product.price).toFixed(2)}
                  </span>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemove(product)}
                  disabled={toggleFeatured.isPending}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available products to add */}
      <div>
        <h2 className="font-heading text-lg uppercase text-secondary-foreground mb-4">
          Produtos Disponíveis
        </h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/30" size={18} />
          <Input
            placeholder="Buscar produtos para adicionar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
          />
        </div>

        {availableProducts.length === 0 ? (
          <div className="text-secondary-foreground/40 text-center py-8 text-sm">
            {search ? "Nenhum produto encontrado." : "Todos os produtos ativos já estão na vitrine."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-3 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => handleAdd(product)}
              >
                {product.images?.[0] ? (
                  <img
                    src={getProductImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-secondary-foreground/10 flex items-center justify-center">
                    <span className="text-secondary-foreground/30 text-[10px]">N/A</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-secondary-foreground text-sm font-medium truncate">{product.name}</p>
                  <p className="text-secondary-foreground/50 text-xs">{product.category?.name}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-[10px] flex-shrink-0">
                  + Adicionar
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVitrine;
