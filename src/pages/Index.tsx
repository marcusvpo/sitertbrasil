import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, Phone, Mail, Instagram, CheckCircle, Trophy, Zap, Shield, DollarSign, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/ScrollAnimation";
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
      {/* Scroll Animation — clean, no overlay */}
      <ScrollAnimation />

      {/* Hero Text + CTAs */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container text-center">
          <span className="inline-block font-heading uppercase text-primary text-sm tracking-[0.2em] mb-4">
            Distribuidora Oficial MOTOREX no Brasil
          </span>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-6">
            Performance Máxima Para Quem Vive o{" "}
            <span className="text-primary">Motocross</span>
          </h1>
          <p className="text-secondary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Lubrificantes e produtos de alta tecnologia suíça para quem exige o
            melhor da sua máquina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-heading uppercase tracking-wider text-base">
              <Link to="/seja-revendedor">
                Quero ser revendedor <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading uppercase tracking-wider text-base border-primary/40 text-primary hover:bg-primary/10">
              <Link to="/motorex">Conhecer produtos MOTOREX</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Vitrine</span>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2">
              Produtos em Destaque
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <Link key={p.id} to={`/motorex/${p.slug}`} className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={getImageUrl(p.images[0].storage_path)} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
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
            ))}
          </div>
        </div>
      </section>

      {/* Institutional */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
                {[
                  { icon: Shield, text: "Qualidade suíça certificada" },
                  { icon: Zap, text: "Performance comprovada em campeonatos FIM" },
                  { icon: Trophy, text: "Rendimento superior" },
                  { icon: DollarSign, text: "Preço justo e competitivo" },
                  { icon: Truck, text: "Pronta entrega em 1-2 dias" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-secondary-foreground/80">
                    <item.icon size={18} className="text-primary flex-shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10">
                <Link to="/quem-somos">Saiba mais <ArrowRight className="ml-2" size={16} /></Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <img src="/images/logo-motorex.png" alt="MOTOREX" className="max-w-[280px] w-full opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Seja Revendedor */}
      <section className="bg-background">
        <div className="relative w-full overflow-hidden">
          <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" className="w-full h-auto block" />
          <div className="absolute inset-0 bg-secondary/60" />
      <div className="absolute inset-0 bg-secondary/40" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-secondary-foreground max-w-lg">
              <p className="text-secondary-foreground/90 mb-4 text-sm md:text-base">
                Faça parte da rede de revendedores MOTOREX no Brasil. Condições especiais e suporte completo.
              </p>
              <Button asChild className="font-heading uppercase tracking-wider">
                <Link to="/seja-revendedor">Cadastre-se agora <ArrowRight className="ml-2" size={16} /></Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Indique Cidade */}
      <section className="bg-background">
        <div className="relative w-full overflow-hidden">
          <img src="/images/banner-indique.jpg" alt="Indique sua Cidade" className="w-full h-auto block" />
          <div className="absolute inset-0 bg-secondary/60" />
      <div className="absolute inset-0 bg-secondary/40" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-secondary-foreground max-w-lg">
              <p className="text-secondary-foreground/90 mb-4 text-sm md:text-base">
                Não encontrou MOTOREX na sua região? Indique uma loja ou seja o primeiro a revender.
              </p>
              <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-secondary-foreground/40 text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/indique-cidade">Indicar agora <ArrowRight className="ml-2" size={16} /></Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Depoimentos</span>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2">O que dizem nossos parceiros</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
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
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10">
              <Link to="/depoimentos">Ver todos os depoimentos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Fale Conosco</span>
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold mt-2 mb-8">Contato Rápido</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone size={20} /> WhatsApp
            </a>
            <a href="mailto:contato@rtbrasil.com.br" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Mail size={20} /> contato@rtbrasil.com.br
            </a>
            <a href="https://instagram.com/rtbrasil" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Instagram size={20} /> @rtbrasil
            </a>
          </div>
          <Button asChild size="lg" className="font-heading uppercase tracking-wider">
            <Link to="/central-atendimento">Central de Atendimento</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
