import { Link } from "react-router-dom";
import { Trophy, Instagram, ChevronLeft, Medal, Star, Flame, Zap, ChevronDown } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const img = (name: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/parceiros/heitor/${name}`;

const achievements = [
  { year: "2021", title: "Brasileiro de MX", category: "50cc", icon: Trophy },
  { year: "2021", title: "Arena Cross", category: "50cc", icon: Medal },
  { year: "2021", title: "Paulista de MX", category: "50cc", icon: Star },
  { year: "2019", title: "Pan-Americano de BMX", category: "", icon: Flame },
  { year: "2019", title: "Brasileiro de BMX", category: "", icon: Zap },
];

const parallaxImages = [
  { src: img("foto1.jpg"), alt: "Heitor Matos em ação no motocross" },
  { src: img("foto2.jpg"), alt: "Heitor Matos manobra de motocross" },
  { src: img("foto3.jpg"), alt: "Heitor Matos salto de motocross" },
];

/* ─── Parallax Background Section ─── */
const ParallaxSection = ({
  src,
  alt,
  children,
  overlay = "from-secondary via-secondary/40 to-secondary",
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
  overlay?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      setOffset(progress * 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden flex items-center justify-center">
    <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
        style={{ transform: `translateY(${offset}px)` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-40" />
      {children && <div className="relative z-10 w-full">{children}</div>}
    </div>
  );
};

/* ─── Animated Counter ─── */
const Counter = ({ target, label }: { target: string; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isNumber = !isNaN(Number(target));

  useEffect(() => {
    if (!isNumber) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const end = Number(target);
          let current = 0;
          const step = Math.max(1, Math.floor(end / 30));
          const interval = setInterval(() => {
            current += step;
            if (current >= end) {
              setCount(end);
              clearInterval(interval);
            } else {
              setCount(current);
            }
          }, 40);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isNumber]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-6xl font-bold text-primary drop-shadow-[0_0_20px_hsl(197_100%_43.7%/0.4)]">
        {isNumber ? count : target}
      </div>
      <div className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-[0.2em] mt-2">
        {label}
      </div>
    </div>
  );
};

/* ─── Tire Track Divider ─── */
const TireTrack = () => (
  <div className="relative py-4 overflow-hidden">
    <div className="flex items-center justify-center gap-1 opacity-20">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-6 bg-primary/60 rounded-full"
          style={{ transform: `rotate(${i % 2 === 0 ? 15 : -15}deg)`, opacity: 0.3 + Math.random() * 0.7 }}
        />
      ))}
    </div>
  </div>
);

/* ─── Speed Lines Background ─── */
const SpeedLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse"
        style={{
          top: `${10 + i * 12}%`,
          left: `-10%`,
          right: `-10%`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${2 + i * 0.5}s`,
          transform: `rotate(${-2 + i * 0.5}deg)`,
        }}
      />
    ))}
  </div>
);

const HeitorMatos = () => {
  return (
    <div className="bg-secondary text-secondary-foreground">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={img("heitorpng.png")}
            alt="Heitor Matos"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/30 to-transparent" />
        </div>

        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <SpeedLines />

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 animate-bounce">
          <span className="text-primary/60 text-xs font-heading uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </div>

        <div className="relative container pb-20 md:pb-28 pt-32 z-10">
          <Link
            to="/parceiros"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-heading uppercase tracking-wider mb-8 hover:gap-3 transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" /> Parceiros
          </Link>

          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-heading uppercase tracking-wider px-3 py-1 btn-clip">
                Parceiro RT Brasil
              </span>
              <a
                href="https://instagram.com/heitormatos300"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-secondary-foreground/40 text-xs hover:text-primary transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" /> @heitormatos300
              </a>
            </div>

            <h1 className="font-heading text-[60px] md:text-[100px] lg:text-[130px] uppercase font-bold leading-[0.85] mb-6">
              Heitor
              <br />
              <span className="text-gradient drop-shadow-[0_0_40px_hsl(197_100%_43.7%/0.3)]">Matos</span>
            </h1>

            <p className="text-secondary-foreground/60 text-lg md:text-xl max-w-xl leading-relaxed">
              Aos 9 anos, Heitor já acumula{" "}
              <strong className="text-secondary-foreground">5 títulos nacionais e internacionais</strong> em
              Motocross e BMX. Um dos maiores talentos da nova geração.
            </p>
          </AnimateOnScroll>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="relative z-10 py-12 md:py-16">
        <SpeedLines />
        <div className="container">
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="liquid-glass rounded-lg p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <Counter target="5" label="Títulos" />
              <Counter target="🥇" label="Todas Ouro" />
              <Counter target="2" label="Modalidades" />
              <Counter target="MX" label="Categoria" />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <TireTrack />

      {/* ═══════════ PARALLAX IMAGE 1 — Full Screen ═══════════ */}
      <ParallaxSection
        src={parallaxImages[0].src}
        alt={parallaxImages[0].alt}
        overlay="from-secondary via-transparent to-secondary"
      >
        <div className="container text-center py-20">
          <AnimateOnScroll animation="scale-in">
            <span className="font-heading text-[48px] md:text-[80px] lg:text-[100px] uppercase font-bold leading-none text-secondary-foreground/10">
              BORN TO RIDE
            </span>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      {/* ═══════════ ACHIEVEMENTS ═══════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SpeedLines />
        {/* Diagonal stripe accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/[0.03] to-transparent skew-x-[-12deg] translate-x-20" />

        <div className="container relative">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center gap-4 justify-center mb-2">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">Palmarés</span>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h2 className="font-heading text-[36px] md:text-[56px] uppercase font-bold text-center mb-12 leading-none">
              Conquistas
            </h2>
          </AnimateOnScroll>

          <div className="max-w-3xl mx-auto space-y-4">
            {achievements.map((a, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="glass-card rounded-lg p-5 md:p-6 flex items-center gap-4 group hover:translate-x-2 transition-all duration-500">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <a.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg md:text-xl uppercase font-bold leading-tight">
                      🥇 {a.title}
                    </h3>
                    <p className="text-secondary-foreground/50 text-sm">
                      {a.year}
                      {a.category ? ` — ${a.category}` : ""}
                    </p>
                  </div>
                  <div className="text-primary font-heading text-3xl font-bold opacity-10 group-hover:opacity-40 transition-opacity duration-500">
                    {a.year}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <TireTrack />

      {/* ═══════════ PARALLAX IMAGE 2 — Full Screen ═══════════ */}
      <ParallaxSection
        src={parallaxImages[1].src}
        alt={parallaxImages[1].alt}
        overlay="from-secondary via-secondary/20 to-secondary"
      >
        <div className="container text-center py-20">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-heading text-[36px] md:text-[56px] uppercase font-bold leading-none mb-4">
              Velocidade & <span className="text-gradient">Precisão</span>
            </h2>
            <p className="text-secondary-foreground/50 max-w-md mx-auto">
              Cada salto, cada curva — dominados com maestria absoluta.
            </p>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      {/* ═══════════ ABOUT / BIO ═══════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SpeedLines />
        <div className="container">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 items-center">
            <AnimateOnScroll animation="fade-in-left" className="md:col-span-2">
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] group">
                <img
                  src={img("heitorpng.png")}
                  alt="Heitor Matos - Piloto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                {/* Glow frame */}
                <div className="absolute inset-0 rounded-lg border border-primary/10 group-hover:border-primary/30 transition-colors duration-500" />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-right" className="md:col-span-3">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-[1px] w-10 bg-primary/50" />
                  <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">Sobre</span>
                </div>
                <h2 className="font-heading text-[36px] md:text-[48px] uppercase font-bold leading-none mb-6">
                  Quem é <span className="text-gradient">Heitor</span>
                </h2>
                <div className="space-y-4 text-secondary-foreground/60 leading-relaxed text-base md:text-lg">
                  <p>
                    Heitor Matos iniciou sua trajetória no motociclismo desde muito cedo, já demonstrando
                    talento excepcional nas pistas de BMX antes de migrar para o Motocross.
                  </p>
                  <p>
                    Em <strong className="text-secondary-foreground">2019</strong>, aos 6 anos, conquistou o
                    título de{" "}
                    <strong className="text-primary">Campeão Brasileiro e Pan-Americano de BMX</strong>. Dois
                    anos depois, dominou a categoria 50cc do Motocross brasileiro, vencendo o Brasileiro, o
                    Arena Cross e o Paulista de MX.
                  </p>
                  <p>
                    Representando a <strong className="text-secondary-foreground">Husqvarna Power Husky / Goldentyre</strong>,
                    Heitor segue como uma das grandes promessas do esporte nacional, inspirando uma nova
                    geração de pilotos.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://instagram.com/heitormatos300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="btn-clip hover-glow text-base px-6 py-3">
                      <Instagram className="w-4 h-4 mr-2" /> Seguir no Instagram
                    </Button>
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <TireTrack />

      {/* ═══════════ PARALLAX IMAGE 3 — Full Screen ═══════════ */}
      <ParallaxSection
        src={parallaxImages[2].src}
        alt={parallaxImages[2].alt}
        overlay="from-secondary via-secondary/30 to-secondary"
      >
        <div className="container text-center py-20">
          <AnimateOnScroll animation="scale-in">
            <span className="font-heading text-[48px] md:text-[80px] lg:text-[100px] uppercase font-bold leading-none text-secondary-foreground/10">
              FULL THROTTLE
            </span>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SpeedLines />
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <div className="liquid-glass rounded-lg p-10 md:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
              {/* Diagonal accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -skew-x-12 translate-x-8 -translate-y-4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 -skew-x-12 -translate-x-4 translate-y-4" />

              <div className="relative">
                <div className="flex items-center gap-4 justify-center mb-4">
                  <div className="h-[1px] w-12 bg-primary/50" />
                  <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">RT Brasil</span>
                  <div className="h-[1px] w-12 bg-primary/50" />
                </div>
                <h2 className="font-heading text-[28px] md:text-[44px] uppercase font-bold leading-none mb-4">
                  Produtos utilizados por{" "}
                  <span className="text-gradient">Heitor</span>
                </h2>
                <p className="text-secondary-foreground/50 mb-8 max-w-md mx-auto text-base md:text-lg">
                  Conheça a linha MOTOREX escolhida por pilotos campeões como o Heitor Matos.
                </p>
                <Link to="/motorex">
                  <Button className="btn-clip hover-glow text-base px-10 py-4">
                    Ver produtos MOTOREX
                  </Button>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
};

export default HeitorMatos;
