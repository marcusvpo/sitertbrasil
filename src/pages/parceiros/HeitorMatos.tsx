import { Link } from "react-router-dom";
import { Trophy, Instagram, ChevronLeft, Medal, Star, Flame, Zap } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const img = (name: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/parceiros/${name}`;

const achievements = [
  { year: "2021", title: "Brasileiro de MX", category: "50cc", icon: Trophy },
  { year: "2021", title: "Arena Cross", category: "50cc", icon: Medal },
  { year: "2021", title: "Paulista de MX", category: "50cc", icon: Star },
  { year: "2019", title: "Pan-Americano de BMX", category: "", icon: Flame },
  { year: "2019", title: "Brasileiro de BMX", category: "", icon: Zap },
];

const galleryImages = [
  { src: img("foto1.png"), alt: "Heitor Matos em ação no motocross" },
  { src: img("foto2.png"), alt: "Heitor Matos manobra de motocross" },
  { src: img("foto3.png"), alt: "Heitor Matos salto de motocross" },
];

const HeitorMatos = () => {
  return (
    <div className="bg-secondary text-secondary-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={img("heitorpng.png")}
            alt="Heitor Matos"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-transparent to-transparent" />
        </div>

        {/* Animated grain */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Content */}
        <div className="relative container pb-12 md:pb-20 pt-32">
          <Link
            to="/parceiros"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-heading uppercase tracking-wider mb-6 hover:gap-3 transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" /> Parceiros
          </Link>

          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-heading uppercase tracking-wider px-3 py-1">
                Parceiro RT Brasil
              </span>
              <a
                href="https://instagram.com/heitormatos300"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/60 text-xs hover:text-primary transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" /> @heitormatos300
              </a>
            </div>

            <h1 className="font-heading text-[52px] md:text-[80px] lg:text-[96px] uppercase font-bold leading-[0.9] mb-4">
              Heitor
              <br />
              <span className="text-gradient">Matos</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-xl leading-relaxed">
              Aos 9 anos, Heitor já acumula <strong className="text-white">5 títulos nacionais e internacionais</strong> em Motocross e BMX. 
              Um dos maiores talentos da nova geração do esporte.
            </p>
          </AnimateOnScroll>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 -mt-1">
        <div className="container">
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="glass-card rounded-lg p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">5</div>
                <div className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider mt-1">Títulos</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">🥇</div>
                <div className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider mt-1">Todas Ouro</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">2</div>
                <div className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider mt-1">Modalidades</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary">MX</div>
                <div className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-wider mt-1">Categoria</div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 md:py-20">
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold text-center mb-2 leading-none">
              Conquistas
            </h2>
            <p className="text-secondary-foreground/50 text-center mb-10">
              Um currículo de campeão
            </p>
          </AnimateOnScroll>

          <div className="max-w-3xl mx-auto space-y-4">
            {achievements.map((a, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="glass-card rounded-lg p-5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <a.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg uppercase font-bold leading-tight">
                      🥇 {a.title}
                    </h3>
                    <p className="text-secondary-foreground/50 text-sm">
                      {a.year}{a.category ? ` — ${a.category}` : ""}
                    </p>
                  </div>
                  <div className="text-primary font-heading text-2xl font-bold opacity-20 group-hover:opacity-60 transition-opacity">
                    {a.year}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-20">
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold text-center mb-2 leading-none">
              Galeria
            </h2>
            <p className="text-secondary-foreground/50 text-center mb-10">
              Heitor em ação nas pistas
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {galleryImages.map((photo, i) => (
              <AnimateOnScroll key={i} animation="scale-in" delay={i * 150}>
                <div className="relative group overflow-hidden rounded-lg aspect-[4/5]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About / Bio */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <AnimateOnScroll animation="fade-in-left">
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <img
                  src={img("heitorpng.png")}
                  alt="Heitor Matos - Piloto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-in-right">
              <div>
                <h2 className="font-heading text-[32px] md:text-[40px] uppercase font-bold leading-none mb-4">
                  Sobre <span className="text-gradient">Heitor</span>
                </h2>
                <div className="space-y-4 text-secondary-foreground/70 leading-relaxed">
                  <p>
                    Heitor Matos iniciou sua trajetória no motociclismo desde muito cedo, 
                    já demonstrando talento excepcional nas pistas de BMX antes de migrar para o Motocross.
                  </p>
                  <p>
                    Em 2019, aos 6 anos, conquistou o título de Campeão Brasileiro e Pan-Americano 
                    de BMX. Dois anos depois, dominou a categoria 50cc do Motocross brasileiro, 
                    vencendo o Brasileiro, o Arena Cross e o Paulista de MX.
                  </p>
                  <p>
                    Representando a Husqvarna Power Husky/Goldentyre, Heitor segue como uma 
                    das grandes promessas do esporte nacional, inspirando uma nova geração 
                    de pilotos.
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href="https://instagram.com/heitormatos300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="btn-clip hover-glow">
                      <Instagram className="w-4 h-4 mr-2" /> Seguir no Instagram
                    </Button>
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <div className="liquid-glass rounded-lg p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="font-heading text-[28px] md:text-[40px] uppercase font-bold leading-none mb-3">
                Produtos utilizados por <span className="text-gradient">Heitor</span>
              </h2>
              <p className="text-secondary-foreground/60 mb-6 max-w-md mx-auto">
                Conheça a linha MOTOREX escolhida por pilotos campeões como o Heitor Matos.
              </p>
              <Link to="/motorex">
                <Button className="btn-clip hover-glow text-base px-8 py-3">
                  Ver produtos MOTOREX
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
};

export default HeitorMatos;
