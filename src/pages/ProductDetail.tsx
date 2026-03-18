import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory, ProductImage } from "@/types/database";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";

const getImageUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/products/${path}`;

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:product_categories(*), images:product_images(*)")
        .eq("slug", slug!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data as Product & { category: ProductCategory | null; images: ProductImage[] };
    },
  });

  if (isLoading) {
    return (
      <div className="bg-secondary min-h-[60vh] flex items-center justify-center">
        <div className="text-secondary-foreground/40">Carregando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-secondary min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-foreground/50 text-lg mb-4">Produto não encontrado.</p>
          <Button asChild variant="outline">
            <Link to="/motorex">Voltar à vitrine</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images?.sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <section className="bg-secondary text-secondary-foreground py-6 md:py-10 min-h-[60vh]">
      <div className="container">
        <Button
          asChild
          variant="ghost"
          className="text-secondary-foreground/60 hover:text-secondary-foreground mb-4"
        >
          <Link to="/motorex">
            <ArrowLeft size={18} className="mr-2" /> Voltar à vitrine
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Gallery */}
          <AnimateOnScroll animation="fade-in-left">
            <div>
              <div className="relative aspect-square glass-card rounded-lg overflow-hidden mb-3">
                {images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(images[activeImage].storage_path)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 glass rounded-full p-2 text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => setActiveImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 glass rounded-full p-2 text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-secondary-foreground/20 text-2xl uppercase">
                      {product.name}
                    </span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all duration-300 ${
                        i === activeImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageUrl(img.storage_path)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {/* Info */}
          <AnimateOnScroll animation="fade-in-right">
            <div>
              {product.category && (
                <span className="text-primary text-xs font-heading uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              <h1 className="font-heading text-[32px] md:text-[42px] uppercase font-bold mt-1 mb-3 leading-[0.95]">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-5">
                {product.badge && (
                  <Badge className="bg-primary/10 text-primary border-0 font-heading uppercase tracking-wider text-xs btn-clip">
                    {product.badge}
                  </Badge>
                )}
                {product.volume && (
                  <Badge variant="secondary" className="bg-secondary-foreground/10 text-secondary-foreground/60 border-0">
                    {product.volume}
                  </Badge>
                )}
              </div>

              {product.short_description && (
                <p className="text-secondary-foreground/70 mb-4">{product.short_description}</p>
              )}

              {product.description && (
                <div className="prose prose-invert prose-sm max-w-none mb-6">
                  <p className="text-secondary-foreground/60 whitespace-pre-wrap leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Price & Actions */}
              <div className="liquid-glass rounded-lg p-5 space-y-4">
                <div className="flex items-baseline gap-3">
                  {product.price ? (
                    <span className="font-heading text-3xl text-primary font-bold">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-secondary-foreground/40 text-sm">Consulte preço</span>
                  )}
                  {product.compare_price && (
                    <span className="text-secondary-foreground/30 text-lg line-through">
                      R$ {Number(product.compare_price).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {product.price ? (
                    <>
                      <div className="flex items-center border border-secondary-foreground/20 rounded-md overflow-hidden h-11">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3 h-full text-secondary-foreground/60 hover:bg-secondary-foreground/10 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-heading text-secondary-foreground">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="px-3 h-full text-secondary-foreground/60 hover:bg-secondary-foreground/10 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <Button
                        size="lg"
                        className="font-heading uppercase tracking-wider flex-1 hover-glow"
                        onClick={() => {
                          addToCart(product, quantity);
                          setQuantity(1);
                        }}
                      >
                        <ShoppingCart size={18} className="mr-2" /> Adicionar ao Carrinho
                      </Button>
                    </>
                  ) : (
                    <Button asChild size="lg" className="font-heading uppercase tracking-wider flex-1">
                      <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer">
                        Consultar via WhatsApp
                      </a>
                    </Button>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10">
                  <Link to="/seja-revendedor">Seja Revendedor</Link>
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
