import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, ShoppingCart } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import GlareCard from "@/components/GlareCard";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory, ProductImage } from "@/types/database";
import { getProductImageUrl } from "@/lib/image-utils";
import ProductRating from "@/components/ProductRating";

/* Shimmer skeleton for loading state */
const ProductSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-muted/30 border border-foreground/[0.04]">
    <div
      className="aspect-square"
      style={{
        background: "linear-gradient(-90deg, hsl(0 0% 10%) 0%, hsl(0 0% 14%) 50%, hsl(0 0% 10%) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer-loading 1.5s ease-in-out infinite",
      }}
    />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 rounded bg-foreground/5" />
      <div className="h-4 w-3/4 rounded bg-foreground/5" />
      <div className="h-4 w-1/3 rounded bg-foreground/5" />
    </div>
  </div>
);

const Motorex = () => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeVolume, setActiveVolume] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["pub-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ProductCategory[];
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["pub-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:product_categories(*), images:product_images(*)")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as (Product & { category: ProductCategory | null; images: ProductImage[] })[];
    },
  });

  const volumes = [...new Set(products.map((p) => p.volume).filter(Boolean))] as string[];

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || p.category_id === activeCategory;
    const matchesVolume = !activeVolume || p.volume === activeVolume;
    return matchesSearch && matchesCategory && matchesVolume;
  });

  return (
    <>
      {/* Banner */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/images/banner-motorex.jpg"
          alt="MOTOREX - Distribuidor Oficial"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Filter Bar — Neon pills ── */}
      <section className="md:sticky md:top-12 z-30 border-b border-foreground/[0.06] bg-background/90 backdrop-blur-xl">
        <div className="container py-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm neon-focus rounded-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-foreground/10 text-foreground h-9 text-sm"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3.5 py-1.5 text-[11px] font-heading uppercase tracking-wider rounded-full transition-all duration-300 ${
                  !activeCategory
                    ? "bg-primary/15 border border-primary text-primary shadow-[0_0_12px_hsl(197_100%_43.7%/0.2)]"
                    : "bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`px-3.5 py-1.5 text-[11px] font-heading uppercase tracking-wider rounded-full transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-primary/15 border border-primary text-primary shadow-[0_0_12px_hsl(197_100%_43.7%/0.2)]"
                      : "bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Volume pills */}
            {volumes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {volumes.map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setActiveVolume(activeVolume === vol ? null : vol)}
                    className={`px-3 py-1 rounded-full text-[11px] font-heading uppercase tracking-wider transition-all duration-300 ${
                      activeVolume === vol
                        ? "bg-primary/15 border border-primary text-primary"
                        : "bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="relative py-10 md:py-16 min-h-[50vh] mesh-gradient">
        <div className="container relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-heading uppercase">Nenhum produto encontrado</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Tente outro filtro ou busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {filtered.map((product, i) => (
                <AnimateOnScroll key={product.id} animation="fade-up" delay={(i % 4) * 80}>
                  <GlareCard>
                    <Link
                      to={`/motorex/${product.slug}`}
                      className="group block glass-card rounded-lg overflow-hidden transition-all duration-500 h-full"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {/* Radial glow */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-1/2 h-1/2 rounded-full bg-primary/8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                        {product.images?.[0] ? (
                          <img
                            src={getProductImageUrl(product.images[0])}
                            alt={product.name}
                            className="relative z-[1] w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-heading text-muted-foreground text-lg uppercase">
                              {product.name}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500 z-[2]" />

                        {product.badge && (
                          <span className="absolute top-2 left-2 z-[3] bg-primary text-primary-foreground text-[9px] font-heading uppercase tracking-wider px-2 py-0.5 btn-clip">
                            {product.badge}
                          </span>
                        )}
                        {product.price && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="absolute bottom-0 inset-x-0 z-[3] bg-primary/90 backdrop-blur-sm text-primary-foreground py-2.5 flex items-center justify-center gap-2 font-heading uppercase text-xs tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                          >
                            <ShoppingCart size={14} /> Adicionar
                          </button>
                        )}
                      </div>

                      <div className="p-3 md:p-4">
                        {product.category && (
                          <span className="text-primary text-[10px] font-heading uppercase tracking-wider">
                            {product.category.name}
                          </span>
                        )}
                        <h3 className="font-heading text-sm md:text-base font-semibold mt-0.5 leading-tight">
                          {product.name}
                        </h3>
                        {product.short_description && (
                          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                            {product.short_description}
                          </p>
                        )}
                        <ProductRating productName={product.name} size="sm" />
                        <div className="flex items-baseline gap-2 mt-2">
                          {product.price && (
                            <span className="font-heading text-primary font-bold text-sm md:text-base">
                              R$ {Number(product.price).toFixed(2)}
                            </span>
                          )}
                          {product.compare_price && (
                            <span className="text-muted-foreground/50 text-xs line-through">
                              R$ {Number(product.compare_price).toFixed(2)}
                            </span>
                          )}
                          {product.volume && (
                            <Badge variant="secondary" className="text-[9px] bg-foreground/5 text-muted-foreground border-0 ml-auto">
                              {product.volume}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  </GlareCard>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Motorex;
