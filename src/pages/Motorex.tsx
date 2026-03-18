import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingBag, ShoppingCart } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory, ProductImage } from "@/types/database";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";

const getImageUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/products/${path}`;

const Motorex = () => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeVolume, setActiveVolume] = useState<string | null>(null);
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
      {/* Banner — clean, no overlay, no text */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/images/banner-motorex.jpg"
          alt="MOTOREX - Distribuidor Oficial"
          className="w-full h-auto block"
        />
      </section>

      {/* Filters */}
      <section className="bg-secondary border-b border-secondary-foreground/10 sticky top-16 md:top-20 z-30">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/30" size={16} />
              <Input
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground h-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-secondary-foreground/30" />
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider transition-colors ${
                  !activeCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary-foreground/10 text-secondary-foreground/60 hover:text-secondary-foreground"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider transition-colors ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary-foreground/10 text-secondary-foreground/60 hover:text-secondary-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {volumes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {volumes.map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setActiveVolume(activeVolume === vol ? null : vol)}
                    className={`px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider transition-colors ${
                      activeVolume === vol
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary-foreground/10 text-secondary-foreground/60 hover:text-secondary-foreground"
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

      {/* Products grid */}
      <section className="bg-secondary py-12 md:py-16 min-h-[50vh]">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-secondary-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-secondary-foreground/20 mb-4" />
              <p className="text-secondary-foreground/50 font-heading uppercase">Nenhum produto encontrado</p>
              <p className="text-secondary-foreground/30 text-sm mt-1">Tente outro filtro ou busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product, i) => (
                <AnimateOnScroll key={product.id} animation="fade-up" delay={(i % 4) * 80}>
                  <Link
                    to={`/motorex/${product.slug}`}
                    className="group block bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg overflow-hidden hover:border-primary/40 hover-lift hover-glow transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-secondary-foreground/5 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0].storage_path)}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-heading text-secondary-foreground/20 text-lg uppercase">
                            {product.name}
                          </span>
                        </div>
                      )}
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-3 md:p-4">
                      {product.category && (
                        <span className="text-primary text-[10px] font-heading uppercase tracking-wider">
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="font-heading text-sm md:text-base uppercase font-semibold text-secondary-foreground mt-0.5 leading-tight">
                        {product.name}
                      </h3>
                      {product.short_description && (
                        <p className="text-secondary-foreground/50 text-xs mt-1 line-clamp-2">
                          {product.short_description}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mt-2">
                        {product.price && (
                          <span className="font-heading text-primary font-bold text-sm md:text-base">
                            R$ {Number(product.price).toFixed(2)}
                          </span>
                        )}
                        {product.compare_price && (
                          <span className="text-secondary-foreground/30 text-xs line-through">
                            R$ {Number(product.compare_price).toFixed(2)}
                          </span>
                        )}
                        {product.volume && (
                          <Badge variant="secondary" className="text-[9px] bg-secondary-foreground/10 text-secondary-foreground/50 border-0 ml-auto">
                            {product.volume}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
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
