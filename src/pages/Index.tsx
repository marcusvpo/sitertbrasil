import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, Phone, Mail, Instagram, Shield, Trophy, Zap, DollarSign, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ScrollAnimation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import GlareCard from "@/components/GlareCard";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductCategory, ProductImage } from "@/types/database";
import { getProductImageUrl } from "@/lib/image-utils";

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

/* Dust particle positions for hero */
const dustParticles = [
  { left: "10%", bottom: "20%", delay: "0s", size: 3 },
  { left: "25%", bottom: "40%", delay: "1.2s", size: 2 },
  { left: "45%", bottom: "15%", delay: "0.6s", size: 4 },
  { left: "65%", bottom: "55%", delay: "2s", size: 2 },
  { left: "80%", bottom: "30%", delay: "0.3s", size: 3 },
  { left: "90%", bottom: "10%", delay: "1.8s", size: 2 },
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
      {/* ── HERO — Full-screen immersive ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background image with parallax feel */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-motocross.jpg"
            alt="Motocross em ação"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          {/* Heavy gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
        </div>

        {/* Floating dust particles */}
        {dustParticles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/40 animate-float-dust"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}

        {/* Hero content */}
        <div className="relative z-10 container pb-20 md:pb-28">
          <AnimateOnScroll animation="blur-in">
            <span className="inline-block font-heading uppercase text-primary text-xs tracking-[0.3em] mb-4">
              Distribuidora Oficial MOTOREX no Brasil
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <h1 className="font-heading text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] mb-6 max-w-4xl">
              Performance Máxima Para Quem Vive o{" "}
              <span className="text-gradient">Motocross</span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={400}>
            <p className="text-foreground/60 text-lg md:text-xl max-w-xl mb-8">
              Lubrificantes e produtos de alta tecnologia suíça para quem exige o
              melhor da sua máquina.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-up" delay={500}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-heading uppercase tracking-wider text-base border-beam hover-glow">
                <Link to="/seja-revendedor">
                  Quero ser revendedor <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading uppercase tracking-wider text-base border-primary/30 text-primary hover:bg-primary/10">
                <Link to="/motorex">Conhecer produtos</Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Scroll Animation */}
      <ScrollAnimation />

      {/* ── Featured Products — Asymmetric Grid ── */}
      <section className="relative py-16 md:py-24 mesh-gradient">
        <div className="container relative z-10">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Vitrine</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">
              Produtos em Destaque
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {featuredProducts.map((p, i) => (
              <AnimateOnScroll key={p.id} animation="fade-up" delay={i * 100}>
                <GlareCard
                  className={`${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
                >
                  <Link
                    to={`/motorex/${p.slug}`}
                    className="group block glass-card rounded-lg overflow-hidden transition-all duration-500 h-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {/* Radial glow behind product */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-2/3 h-2/3 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </div>
                      {p.images?.[0] ? (
                        <img
                          src={getProductImageUrl(p.images[0])}
                          alt={p.name}
                          className="relative z-[1] w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                          <span className="font-heading text-2xl uppercase font-bold">{p.name}</span>
                        </div>
                      )}
                      {/* Darken on hover */}
                      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500 z-[2]" />

                      {p.badge && (
                        <span className="absolute top-3 left-3 z-[3] bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-2.5 py-1 btn-clip">
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
                          className="absolute bottom-0 inset-x-0 z-[3] bg-primary/90 backdrop-blur-sm text-primary-foreground py-2.5 flex items-center justify-center gap-2 font-heading uppercase text-xs tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        >
                          <ShoppingCart size={14} /> Adicionar
                        </button>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-heading uppercase tracking-wider">{p.category?.name}</span>
                      <h3 className="font-heading text-lg font-semibold mt-1">{p.name}</h3>
                      {p.price && (
                        <span className="font-heading text-primary font-bold text-sm mt-1 block">
                          R$ {Number(p.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </Link>
                </GlareCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional ── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="fade-in-left">
              <div>
                <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Sobre</span>
                <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2 mb-6">
                  RT Brasil + MOTOREX
                </h2>
                <p className="text-foreground/60 mb-4 leading-relaxed">
                  A RT Brasil é distribuidora oficial da MOTOREX, marca suíça com mais de 100 anos de história e referência mundial em lubrificantes de alta performance.
                </p>
                <p className="text-foreground/60 mb-6 leading-relaxed">
                  Nosso compromisso é levar ao mercado brasileiro produtos de qualidade comprovada em campeonatos mundiais, com pronta entrega e suporte especializado.
                </p>
                <ul className="space-y-3 mb-8">
                  {benefits.map((item, i) => (
                    <AnimateOnScroll key={item.text} animation="slide-up" delay={i * 80}>
                      <li className="flex items-center gap-3 text-foreground/70">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon size={16} className="text-primary" />
                        </div>
                        <span className="text-sm">{item.text}</span>
                      </li>
                    </AnimateOnScroll>
                  ))}
                </ul>
                <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10">
                  <Link to="/quem-somos">Saiba mais <ArrowRight className="ml-2" size={16} /></Link>
                </Button>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-in-right">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px]" />
                  <img src="/images/logo-motorex.png" alt="MOTOREX" className="relative max-w-[280px] w-full opacity-90 hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── Banners (Revendedor + Indique) ── */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <Button asChild className="font-heading uppercase tracking-wider border-beam hover-glow">
            <Link to="/seja-revendedor">Cadastre-se agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>

      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-indique.jpg" alt="Indique sua Cidade" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <Button asChild className="font-heading uppercase tracking-wider border-beam hover-glow">
            <Link to="/indique-cidade">Indicar agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>

      {/* ── Testimonials — Tilted Marquee ── */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container mb-10">
          <AnimateOnScroll className="text-center">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Depoimentos</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">O que dizem nossos parceiros</h2>
          </AnimateOnScroll>
        </div>
        {/* Tilted for race-track dynamism */}
        <div className="pause-on-hover" style={{ transform: "rotate(-2deg)" }}>
          <div className="marquee-track flex gap-6 animate-marquee" style={{ width: "max-content" }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="gradient-border rounded-lg p-6 w-[280px] md:w-[340px] flex-shrink-0">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-heading text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AnimateOnScroll className="text-center mt-10">
          <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10">
            <Link to="/depoimentos">Ver todos os depoimentos</Link>
          </Button>
        </AnimateOnScroll>
      </section>

      {/* ── Quick Contact ── */}
      <section className="relative py-16 md:py-24 mesh-gradient">
        <div className="container relative z-10 text-center">
          <AnimateOnScroll>
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Fale Conosco</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2 mb-8">Contato Rápido</h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-up" delay={200}>
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-10 mb-8">
              {[
                { icon: Phone, label: "WhatsApp", href: "https://wa.me/5500000000000" },
                { icon: Mail, label: "contato@rtbrasil.com.br", href: "mailto:contato@rtbrasil.com.br" },
                { icon: Instagram, label: "@rtbrasil", href: "https://instagram.com/rtbrasil" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-border rounded-lg px-6 py-4 flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors duration-300 min-h-[44px]"
                >
                  <c.icon size={20} className="text-primary" /> {c.label}
                </a>
              ))}
            </div>
            <Button asChild size="lg" className="font-heading uppercase tracking-wider border-beam hover-glow">
              <Link to="/central-atendimento">Central de Atendimento</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
};

export default Index;
