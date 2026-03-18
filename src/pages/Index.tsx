import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, Phone, Mail, Instagram, Shield, Trophy, Zap, DollarSign, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ScrollAnimation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory, ProductImage } from "@/types/database";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const getImageUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/products/${path}`;

const testimonials = [
  { name: "André Ferreira", role: "Piloto Profissional", stars: 5, text: "Desde que comecei a usar MOTOREX, minha moto nunca teve tanta performance. Produto de qualidade incomparável." },
  { name: "Carla Nunes", role: "Revendedora – MG", stars: 5, text: "A RT Brasil entrega rápido e o suporte é excelente. Meus clientes amam a MOTOREX." },
  { name: "João Marques", role: "Mecânico Especialista", stars: 5, text: "Trabalho com diversas marcas, mas a MOTOREX é a que mais confio para motores de alta performance." },
  { name: "Rafael Lima", role: "Piloto Amador", stars: 5, text: "Qualidade suíça de verdade. Senti diferença desde a primeira troca de óleo." },
  { name: "Fernanda Costa", role: "Lojista – SP", stars: 5, text: "Os clientes pedem por nome. MOTOREX se vende sozinho quando você mostra os resultados." },
];

const benefits = [
  { icon: Shield, text: "Qualidade suíça certificada" },
  { icon: Zap, text: "Performance comprovada em campeonatos FIM" },
  { icon: Trophy, text: "Rendimento superior" },
  { icon: DollarSign, text: "Preço justo e competitivo" },
  { icon: Truck, text: "Pronta entrega em 1-2 dias" },
];

const Index = () => {
  const { addToCart } = useCart();
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:product_categories(*), images:product_images(*)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order")
        .limit(4);
      if (error) throw error;
      return data as (Product & { category: ProductCategory | null; images: ProductImage[] })[];
    },
  });

  return (
    <>
      {/* Hero Title */}
      <section className="bg-secondary text-secondary-foreground pt-8 md:pt-14 pb-4 md:pb-8">
        <div className="container text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="inline-block font-heading uppercase text-primary text-sm tracking-[0.25em] mb-3">
              Distribuidora Oficial MOTOREX no Brasil
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <h1 className="font-heading text-[42px] md:text-[64px] font-bold uppercase leading-[0.95] mb-0">
              Performance Máxima Para Quem Vive o{" "}
              <span className="text-gradient">Motocross</span>
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Scroll Animation */}
      <ScrollAnimation />

      {/* CTAs */}
      <section className="bg-secondary text-secondary-foreground py-8 md:py-14">
        <div className="container text-center">
          <AnimateOnScroll animation="fade-up">
            <p className="text-secondary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Lubrificantes e produtos de alta tecnologia suíça para quem exige o
              melhor da sua máquina.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-heading uppercase tracking-wider text-base hover-glow">
                <Link to="/seja-revendedor">
                  Quero ser revendedor <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading uppercase tracking-wider text-base border-primary/40 text-primary hover:bg-primary/10">
                <Link to="/motorex">Conhecer produtos MOTOREX</Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 md:py-16 bg-background">
        <div className="container">
          <AnimateOnScroll className="text-center mb-10">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Vitrine</span>
            <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2">
              Produtos em Destaque
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p, i) => (
              <AnimateOnScroll key={p.id} animation="fade-up" delay={i * 100}>
                <Link to={`/motorex/${p.slug}`} className="group block glass-card rounded-lg overflow-hidden transition-all duration-500">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={getImageUrl(p.images[0].storage_path)} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                        <span className="font-heading text-2xl uppercase font-bold">{p.name}</span>
                      </div>
                    )}
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-2 py-1 btn-clip">
                        {p.badge}
                      </span>
                    )}
                    {p.price && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        className="absolute bottom-0 inset-x-0 bg-primary/90 backdrop-blur-sm text-primary-foreground py-2.5 flex items-center justify-center gap-2 font-heading uppercase text-xs tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <ShoppingCart size={14} /> Adicionar
                      </button>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-primary font-heading uppercase tracking-wider">{p.category?.name}</span>
                    <h3 className="font-heading text-lg uppercase font-semibold mt-1">{p.name}</h3>
                    {p.price && <span className="font-heading text-primary font-bold text-sm mt-1 block">R$ {Number(p.price).toFixed(2)}</span>}
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional */}
      <section className="bg-secondary text-secondary-foreground py-10 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimateOnScroll animation="fade-in-left">
              <div>
                <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Sobre</span>
                <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2 mb-5">
                  RT Brasil + MOTOREX
                </h2>
                <p className="text-secondary-foreground/70 mb-4 leading-relaxed">
                  A RT Brasil é distribuidora oficial da MOTOREX, marca suíça com mais de 100 anos de história e referência mundial em lubrificantes de alta performance.
                </p>
                <p className="text-secondary-foreground/70 mb-5 leading-relaxed">
                  Nosso compromisso é levar ao mercado brasileiro produtos de qualidade comprovada em campeonatos mundiais, com pronta entrega e suporte especializado.
                </p>
                <ul className="space-y-3 mb-6">
                  {benefits.map((item, i) => (
                    <AnimateOnScroll key={item.text} animation="slide-up" delay={i * 80}>
                      <li className="flex items-center gap-3 text-secondary-foreground/80">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon size={16} className="text-primary" />
                        </div>
                        {item.text}
                      </li>
                    </AnimateOnScroll>
                  ))}
                </ul>
                <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10">
                  <Link to="/quem-somos">Saiba mais <ArrowRight className="ml-2" size={16} /></Link>
                </Button>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-in-right">
              <div className="flex justify-center">
                <img src="/images/logo-motorex.png" alt="MOTOREX" className="max-w-[280px] w-full opacity-90 hover:opacity-100 transition-opacity duration-500" />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Hero Motocross Image Section */}
      <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden grain-overlay">
        <img
          src="/images/hero-motocross.jpg"
          alt="Motocross em ação"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-secondary/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-secondary/50" />
        <div className="relative z-20 h-full flex items-center justify-center">
          <AnimateOnScroll animation="scale-in">
            <div className="liquid-glass rounded-lg px-8 py-6 md:px-12 md:py-8 text-center max-w-xl mx-4">
              <h2 className="font-heading text-[28px] md:text-[42px] uppercase font-bold text-primary-foreground leading-tight mb-3">
                Feito Para <span className="text-gradient">Vencer</span>
              </h2>
              <p className="text-primary-foreground/70 text-sm md:text-base mb-4">
                Tecnologia suíça nas pistas brasileiras
              </p>
              <Button asChild className="font-heading uppercase tracking-wider hover-glow">
                <Link to="/motorex">
                  Ver Produtos <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Seja Revendedor Banner */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" className="w-full h-auto block" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-secondary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-8">
          <Button asChild className="font-heading uppercase tracking-wider hover-glow">
            <Link to="/seja-revendedor">Cadastre-se agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>

      {/* Indique Cidade Banner */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-indique.jpg" alt="Indique sua Cidade" className="w-full h-auto block" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-secondary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-8">
          <Button asChild className="font-heading uppercase tracking-wider hover-glow">
            <Link to="/indique-cidade">Indicar agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>

      {/* Testimonials — Sliding Marquee */}
      <section className="bg-secondary text-secondary-foreground py-10 md:py-16 overflow-hidden">
        <div className="container mb-10">
          <AnimateOnScroll className="text-center">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Depoimentos</span>
            <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2">O que dizem nossos parceiros</h2>
          </AnimateOnScroll>
        </div>
        <div className="pause-on-hover">
          <div className="marquee-track flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="glass-card rounded-lg p-6 w-[340px] flex-shrink-0">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-secondary-foreground/80 text-sm leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-heading uppercase text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-secondary-foreground/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AnimateOnScroll className="text-center mt-8">
          <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10">
            <Link to="/depoimentos">Ver todos os depoimentos</Link>
          </Button>
        </AnimateOnScroll>
      </section>

      {/* Quick Contact */}
      <section className="py-10 md:py-16 bg-background">
        <div className="container text-center">
          <AnimateOnScroll>
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Fale Conosco</span>
            <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2 mb-6">Contato Rápido</h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              {[
                { icon: Phone, label: "WhatsApp", href: "https://wa.me/5500000000000" },
                { icon: Mail, label: "contato@rtbrasil.com.br", href: "mailto:contato@rtbrasil.com.br" },
                { icon: Instagram, label: "@rtbrasil", href: "https://instagram.com/rtbrasil" },
              ].map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
                  <c.icon size={20} /> {c.label}
                </a>
              ))}
            </div>
            <Button asChild size="lg" className="font-heading uppercase tracking-wider hover-glow">
              <Link to="/central-atendimento">Central de Atendimento</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
};

export default Index;
