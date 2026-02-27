import { Link } from "react-router-dom";
import { ArrowRight, Star, Phone, Mail, Instagram, CheckCircle, Trophy, Zap, Shield, DollarSign, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredProducts = [
  { id: 1, name: "Cross Power 2T", category: "Óleo de Motor", image: "/images/product-1.webp", badge: "MAIS VENDIDO" },
  { id: 2, name: "Top Speed 15W50", category: "Óleo de Motor", image: "/images/product-2.webp", badge: "MAIS VENDIDO" },
  { id: 3, name: "Racing Fork Oil", category: "Suspensão", image: "/images/product-3.webp", badge: "DESTAQUE" },
  { id: 4, name: "Power Synt 4T", category: "Óleo de Motor", image: "/images/product-4.webp", badge: "DESTAQUE" },
];

const testimonials = [
  { name: "André Ferreira", role: "Piloto Profissional", stars: 5, text: "Desde que comecei a usar MOTOREX, minha moto nunca teve tanta performance. Produto de qualidade incomparável." },
  { name: "Carla Nunes", role: "Revendedora – MG", stars: 5, text: "A RT Brasil entrega rápido e o suporte é excelente. Meus clientes amam a MOTOREX." },
  { name: "João Marques", role: "Mecânico Especialista", stars: 5, text: "Trabalho com diversas marcas, mas a MOTOREX é a que mais confio para motores de alta performance." },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="text-secondary-foreground relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img src="/images/banner-home.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="container relative z-10 text-center md:text-left py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block font-heading uppercase text-primary text-sm tracking-[0.2em] mb-4">
              Distribuidora Oficial MOTOREX no Brasil
            </span>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-6">
              Performance Máxima Para Quem Vive o{" "}
              <span className="text-primary">Motocross</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg md:text-xl max-w-xl mb-8">
              Lubrificantes e produtos de alta tecnologia suíça para quem exige o
              melhor da sua máquina.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
              <div key={p.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative aspect-square bg-muted flex items-center justify-center p-6">
                  <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-2 py-1 rounded-sm">
                    {p.badge}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-primary font-heading uppercase tracking-wider">{p.category}</span>
                  <h3 className="font-heading text-lg uppercase font-semibold mt-1">{p.name}</h3>
                  <Button asChild variant="outline" size="sm" className="mt-3 w-full font-heading uppercase text-xs tracking-wider">
                    <Link to="/motorex">Ver detalhes</Link>
                  </Button>
                </div>
              </div>
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

      {/* Reseller + Indicate */}
      <section className="bg-background">
        <div className="grid md:grid-cols-2">
          {/* Seja Revendedor */}
          <div className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden">
            <img src="/images/banner-revendedor.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-secondary/60" />
            <div className="relative z-10 text-center p-8 md:p-12 text-secondary-foreground">
              <h3 className="font-heading text-3xl md:text-4xl uppercase font-bold mb-4">Seja um Revendedor</h3>
              <p className="text-secondary-foreground/80 mb-6 max-w-md mx-auto">
                Faça parte da rede de revendedores MOTOREX no Brasil. Condições especiais e suporte completo.
              </p>
              <Button asChild className="font-heading uppercase tracking-wider">
                <Link to="/seja-revendedor">Cadastre-se agora <ArrowRight className="ml-2" size={16} /></Link>
              </Button>
            </div>
          </div>
          {/* Indique Cidade */}
          <div className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden">
            <img src="/images/banner-indique.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-secondary/60" />
            <div className="relative z-10 text-center p-8 md:p-12 text-secondary-foreground">
              <h3 className="font-heading text-3xl md:text-4xl uppercase font-bold mb-4">Indique sua Cidade</h3>
              <p className="text-secondary-foreground/80 mb-6 max-w-md mx-auto">
                Não encontrou MOTOREX na sua região? Indique uma loja ou seja o primeiro a revender.
              </p>
              <Button asChild variant="outline" className="font-heading uppercase tracking-wider border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/indique-cidade">Indicar agora <ArrowRight className="ml-2" size={16} /></Link>
              </Button>
            </div>
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
