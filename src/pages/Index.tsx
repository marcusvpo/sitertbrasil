import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, Phone, Mail, Instagram, Shield, Trophy, Zap, DollarSign, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ScrollAnimation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductCategory, ProductImage } from "@/types/database";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const getImageUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/products/${path}`;

const testimonials = [
  { name: "André Ferreira", role: "Piloto Profissional", stars: 5, text: "Desde que comecei a usar MOTOREX, minha moto nunca teve tanta performance. Produto de qualidade incomparável." },
  { name: "Carla Nunes", role: "Revendedora – MG", stars: 5, text: "A RT Brasil entrega rápido e o suporte é excelente. Meus clientes amam a MOTOREX." },
  { name: "João Marques", role: "Mecânico Especialista", stars: 5, text: "Trabalho com diversas marcas, mas a MOTOREX é a que mais confio para motores de alta performance." },
];

const benefits = [
  { icon: Shield, text: "Qualidade suíça certificada" },
  { icon: Zap, text: "Performance comprovada em campeonatos FIM" },
  { icon: Trophy, text: "Rendimento superior" },
  { icon: DollarSign, text: "Preço justo e competitivo" },
  { icon: Truck, text: "Pronta entrega em 1-2 dias" },
];

const Index = () => {
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
      <section className="bg-secondary text-secondary-foreground pt-12 md:pt-20 pb-6 md:pb-10">
        <div className="container text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="inline-block font-heading uppercase text-primary text-sm tracking-[0.25em] mb-4">
              Distribuidora Oficial MOTOREX no Brasil
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-0">
              Performance Máxima Para Quem Vive o{" "}
              <span className="text-gradient">Motocross</span>
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Scroll Animation */}
      <ScrollAnimation />

      {/* CTAs */}
      <section className="bg-secondary text-secondary-foreground py-12 md:py-20">
        <div className="container text-center">
          <AnimateOnScroll animation="fade-up">
            <p className="text-secondary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
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
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Vitrine</span>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2">
              Produtos em Destaque
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p, i) => (
              <AnimateOnScroll key={p.id} animation="fade-up" delay={i * 100}>
                <Link to={`/motorex/${p.slug}`} className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 hover-lift hover-glow transition-all duration-300">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={getImageUrl(p.images[0].storage_path)} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                        <span className="font-heading text-2xl uppercase font-bold">{p.name}</span>
                      </div>
                    )}
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-2 py-1 rounded-sm">
                        {p.badge}
                      </span>
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
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="fade-in-left">
              <div>
                <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Sobre</span>
                <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2 mb-6">
                  RT Brasil + MOTOREX
                </h2>
                <p className="text-secondary-foreground/70 mb-4 leading-relaxed">
                  A RT Brasil é distribuidora oficial da MOTOREX, marca suíça com mais de 100 anos de história e referência mundial em lubrificantes de alta performance.
                </p>
                <p className="text-secondary-foreground/70 mb-6 leading-relaxed">
                  Nosso compromisso é levar ao mercado brasileiro produtos de qualidade comprovada em campeonatos mundiais, com pronta entrega e suporte especializado.
                </p>
                <ul className="space-y-3 mb-8">
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

      {/* Seja Revendedor Banner — clean, no overlay */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" className="w-full h-auto block" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-secondary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <Button asChild className="font-heading uppercase tracking-wider hover-glow">
            <Link to="/seja-revendedor">Cadastre-se agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>

      {/* Indique Cidade Banner — clean, no overlay */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-indique.jpg" alt="Indique sua Cidade" className="w-full h-auto block" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-secondary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <Button asChild className="font-heading uppercase tracking-wider hover-glow">
            <Link to="/indique-cidade">Indicar agora <ArrowRight className="ml-2" size={16} /></Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Depoimentos</span>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2">O que dizem nossos parceiros</h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimateOnScroll key={t.name} animation="fade-up" delay={i * 150}>
                <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-6 hover-lift transition-all duration-300 h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} size={16} className="fill-primary text-primary" />
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
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll className="text-center mt-8">
            <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10">
              <Link to="/depoimentos">Ver todos os depoimentos</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <AnimateOnScroll>
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Fale Conosco</span>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2 mb-8">Contato Rápido</h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="slide-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
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
