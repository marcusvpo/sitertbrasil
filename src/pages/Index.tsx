import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, Phone, Mail, Instagram, Shield, Trophy, Zap, DollarSign, Truck, ShoppingCart, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import GlareCard from "@/components/GlareCard";
import HomeCarousel from "@/components/HomeCarousel";
import LojasParceirasCarousel from "@/components/LojasParceirasCarousel";
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
  { icon: MessageCircle, text: "Suporte técnico especializado" },
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
    <div className="relative">
      {/* Painterly ambient background — paints the green MOTOREX blooms organically */}
      <div aria-hidden className="ambient-canvas" />

      <div className="relative z-10">
        {/* ── HERO — Full-screen immersive ── */}
        <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background image with parallax feel */}
        <div className="absolute inset-0">
          <picture>
            <source srcSet="/images/hero-motocross.webp" type="image/webp" />
            <img
              src="/images/hero-motocross.jpg"
              alt="Motocross em ação"
              width={1920}
              height={1080}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </picture>
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

        {/* Hero content — aligned right */}
        <div className="relative z-10 container pb-20 md:pb-28 flex justify-end">
          <div className="w-full md:w-1/2 md:text-right">
            <AnimateOnScroll animation="blur-in">
              <span className="inline-block font-heading uppercase text-xs tracking-[0.3em] mb-4 bg-white/90 text-background px-4 py-1.5 rounded">
                Distribuidora Oficial <span className="text-motorex">MOTOREX</span> no Brasil
              </span>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={200}>
              <h1 className="font-heading text-[clamp(2.25rem,4.5vw,5.5rem)] font-bold leading-[1.05] md:leading-[0.95] mb-6 [text-wrap:balance] hyphens-auto break-words">
                Performance Máxima Para Quem Vive o{" "}
                <span className="text-gradient">Motocross</span>
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={400}>
              <p className="text-foreground/60 text-lg md:text-xl max-w-xl md:ml-auto mb-8">
                Lubrificantes e produtos de alta tecnologia suíça para quem exige o
                melhor da sua máquina.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-up" delay={500}>
              <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
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
        </div>
      </section>

      {/* ── Image Carousel ── */}
      <HomeCarousel />

      {/* ── Lojas Parceiras Marquee ── */}
      <LojasParceirasCarousel />

      {/* ── Featured Products — Asymmetric Grid ── */}
      <section className="relative py-16 md:py-24 mesh-gradient bleed-from-below">
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
                        <span className="font-heading text-motorex font-bold text-sm mt-1 block">
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
      <section className="relative py-24 md:py-36 overflow-hidden section-motorex-pure">
        <div className="container relative z-10">
          {/* Header centralizado */}
          <AnimateOnScroll animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="font-heading uppercase text-white/80 text-xs tracking-[0.4em]">
              Sobre nós
            </span>
            <h2 className="font-heading text-[clamp(2.25rem,5.5vw,4rem)] font-bold mt-3 mb-6 uppercase leading-[0.95] text-white">
              RT Brasil <span className="text-background">+</span> MOTOREX
            </h2>
            <p className="text-white/85 text-base md:text-lg leading-relaxed">
              Distribuidora oficial da MOTOREX no Brasil — marca suíça com mais de 100 anos forjando lubrificantes que vencem campeonatos mundiais.
              Trazemos performance comprovada, pronta entrega e suporte técnico para quem exige o máximo da sua máquina.
            </p>
          </AnimateOnScroll>

          {/* Grid de benefícios — cards pretos contrastantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-14">
            {benefits.map((item, i) => (
              <AnimateOnScroll key={item.text} animation="fade-up" delay={i * 100}>
                <div className="group relative h-full rounded-2xl p-6 md:p-7 overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-background border border-primary/30 hover:border-primary/60 shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_15px_50px_hsl(197_100%_43.7%/0.25)]">
                  {/* Cyan accent glow on hover */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/40 group-hover:ring-primary/70 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <item.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="font-heading uppercase text-primary text-[10px] tracking-[0.2em] block mb-1">
                        0{i + 1}
                      </span>
                      <p className="font-heading uppercase text-foreground text-base md:text-lg leading-tight font-semibold">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* CTA centralizado — botão preto contrastando no fundo MOTOREX */}
          <AnimateOnScroll animation="fade-up" delay={300} className="text-center">
            <Button
              asChild
              className="font-heading uppercase tracking-wider bg-background hover:bg-background/90 text-white px-8 py-6 text-sm md:text-base shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-white/10 hover:border-white/30 transition-all"
            >
              <Link to="/quem-somos">
                Conheça nossa história <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Banners (Revendedor + Indique) ── */}
      <section className="relative w-full overflow-hidden bleed-from-above">
        <picture>
          <source srcSet="/images/banner-revendedor.webp" type="image/webp" />
          <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" loading="lazy" width={1920} height={600} className="w-full h-auto block" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <Button asChild className="font-heading uppercase tracking-wider bg-motorex hover:bg-motorex/90 text-white border-beam hover-glow">
            <Link to="/seja-revendedor">Cadastre-se agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>


      {/* ── Testimonials — Tilted Marquee ── */}
      <section className="py-16 md:py-24 overflow-hidden bleed-from-below">
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
          <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-motorex/30 text-motorex hover:bg-motorex/10">
            <Link to="/depoimentos">Ver todos os depoimentos</Link>
          </Button>
        </AnimateOnScroll>
      </section>

      {/* ── Quick Contact ── */}
      <section className="relative py-20 md:py-28 section-motorex-glow-intense">
        <div className="container relative z-10">
          <AnimateOnScroll className="text-center">
            <span className="font-heading uppercase text-white/80 text-xs tracking-[0.3em]">Fale Conosco</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2 mb-8 text-white">Contato Rápido</h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-up" delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <a
                href="https://wa.me/5516997964255"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-6 py-4 flex items-center gap-3 text-white/90 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-300 min-h-[44px]"
              >
                <Phone size={20} className="text-white" /> (16) 99796-4255
              </a>
              <a
                href="mailto:vendas@rtbrasilimport.com.br"
                className="rounded-lg px-6 py-4 flex items-center gap-3 text-white/90 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-300 min-h-[44px]"
              >
                <Mail size={20} className="text-white" /> vendas@rtbrasilimport.com.br
              </a>
              <a
                href="https://instagram.com/rtbrasil.motorex"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-6 py-4 flex items-center gap-3 text-white/90 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors duration-300 min-h-[44px]"
              >
                <Instagram size={20} className="text-white" /> @rtbrasil.motorex
              </a>
              <div className="rounded-lg px-6 py-4 flex items-start gap-3 text-white/90 bg-white/10 border border-white/20 min-h-[44px]">
                <MapPin size={20} className="text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm">Av. Alfeu Martini, 790 - Distrito Industrial II, Jaboticabal - SP</span>
              </div>
            </div>
            <p className="text-center text-white/60 text-xs mt-4">
              Rt Brasil Importação e Comércio — CNPJ: 00.913.926/0001-78
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Button asChild size="lg" className="font-heading uppercase tracking-wider bg-green-600 hover:bg-green-700 text-white">
                <a href="https://wa.me/5516997964255" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={18} /> Chamar no WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" className="font-heading uppercase tracking-wider bg-background hover:bg-background/90 text-white border border-white/20 hover:border-white/40">
                <Link to="/central-atendimento">Central de Atendimento</Link>
              </Button>
            </div>

            {/* Google Maps embed */}
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-foreground/10">
              <iframe
                title="Localização RT Brasil"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1000!2d-48.35034751806419!3d-21.250251492402167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDE1JzAwLjkiUyA0OMKwMjEnMDEuMyJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;
