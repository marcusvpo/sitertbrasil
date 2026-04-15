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
import { getProductImageUrl } from "@/lib/image-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductDocumentation from "@/components/ProductDocumentation";
import ProductRating from "@/components/ProductRating";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isMobile = useIsMobile();

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Produto não encontrado.</p>
          <Button asChild variant="outline">
            <Link to="/motorex">Voltar à vitrine</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images?.sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <section className="relative py-8 md:py-14 min-h-[60vh] mesh-gradient overflow-x-hidden">
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground mb-6">
          <Link to="/motorex">
            <ArrowLeft size={18} className="mr-2" /> Voltar à vitrine
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {/* ── Left Column: Gallery + Description (scrollable) ── */}
          <AnimateOnScroll animation={isMobile ? "fade-up" : "fade-in-left"} className="min-w-0">
            <div className="min-w-0">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/20 border border-foreground/[0.06]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 rounded-full bg-primary/10 blur-[80px]" />
                </div>

                {images.length > 0 ? (
                  <>
                    <img
                      src={getProductImageUrl(images[activeImage])}
                      alt={product.name}
                      className="relative z-[1] w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] bg-background/60 backdrop-blur-md rounded-full p-2 text-foreground hover:bg-background/80 transition-colors border border-foreground/10"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => setActiveImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-[2] bg-background/60 backdrop-blur-md rounded-full p-2 text-foreground hover:bg-background/80 transition-colors border border-foreground/10"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-muted-foreground text-2xl uppercase">{product.name}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                        i === activeImage
                          ? "border-primary shadow-[0_0_10px_hsl(197_100%_43.7%/0.3)]"
                          : "border-foreground/10 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={getProductImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Documentation Card */}
              <div className="mt-4">
                <ProductDocumentation productName={product.name} />
              </div>
            </div>
          </AnimateOnScroll>

          {/* ── Right Column: Product Info + Sticky Cart Card ── */}
          <AnimateOnScroll animation={isMobile ? "fade-up" : "fade-in-right"} className="min-w-0">
            <div className="min-w-0 md:sticky md:top-20">
              {product.category && (
                <span className="text-primary text-xs font-heading uppercase tracking-[0.2em]">
                  {product.category.name}
                </span>
              )}
              <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-bold mt-1 mb-4 leading-[0.95] break-words">
                {product.name}
              </h1>

              <ProductRating productName={product.name} size="md" />

              {/* Description (scrollable block) */}
              {(product.short_description || product.description) && (
                <div className="mt-4 mb-4 max-h-[480px] overflow-y-auto pr-2 border border-foreground/[0.06] rounded-lg p-4 bg-muted/10 scrollbar-thin">
                  {product.short_description && (
                    <p className="text-foreground/70 text-sm leading-relaxed break-words mb-3">
                      {product.short_description}
                    </p>
                  )}
                  {product.description && (
                    <div
                      className="max-w-full overflow-hidden break-words prose prose-sm prose-invert text-muted-foreground leading-relaxed [&_*]:!max-w-full [&_*]:!text-muted-foreground [&_img]:h-auto [&_img]:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:break-words [&_th]:break-words"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  )}
                </div>
              )}
              <div className="mb-6 mt-3 flex flex-wrap items-center gap-3">
                {product.badge && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 font-heading uppercase tracking-wider text-xs">
                    {product.badge}
                  </Badge>
                )}
                {product.volume && (
                  <Badge variant="secondary" className="bg-foreground/5 text-muted-foreground border-0">
                    {product.volume}
                  </Badge>
                )}
              </div>

              {/* ── Price & Actions (sticky card) ── */}
              <div className="gradient-border min-w-0 rounded-lg p-4 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  {product.price ? (
                    <span
                      className="font-heading text-3xl text-motorex font-bold"
                      style={{ textShadow: "0 0 30px hsl(var(--motorex) / 0.3)" }}
                    >
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Consulte preço</span>
                  )}
                  {product.compare_price && (
                    <span className="text-muted-foreground/50 text-lg line-through">
                      R$ {Number(product.compare_price).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                  {product.price ? (
                    <>
                      <div className="flex max-w-full self-start overflow-hidden rounded-md border border-foreground/10 h-11">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3 h-full text-muted-foreground hover:bg-foreground/5 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-heading text-foreground flex items-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="px-3 h-full text-muted-foreground hover:bg-foreground/5 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <Button
                        size="lg"
                        className="flex w-full whitespace-normal text-center font-heading uppercase tracking-wider border-beam hover-glow sm:flex-1"
                        onClick={() => {
                          addToCart(product, quantity);
                          setQuantity(1);
                        }}
                      >
                        <ShoppingCart size={18} className="mr-2" /> Adicionar ao Carrinho
                      </Button>
                    </>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className="flex w-full whitespace-normal text-center font-heading uppercase tracking-wider sm:flex-1"
                    >
                      <a href="https://wa.me/5516997964255" target="_blank" rel="noopener noreferrer">
                        Consultar via WhatsApp
                      </a>
                    </Button>
                  )}
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="flex w-full whitespace-normal text-center font-heading uppercase tracking-wider border-motorex/20 text-motorex hover:bg-motorex/10"
                >
                  <Link to="/seja-revendedor">
                    Seja Revendedor <span className="text-motorex font-bold">MOTOREX</span>
                  </Link>
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
