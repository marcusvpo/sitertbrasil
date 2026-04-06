import { Link } from "react-router-dom";
import { Trophy, Instagram, ChevronLeft, Medal, Star, Flame, Zap, ChevronDown, Flag, Gauge, Timer, Target, Bike, Shield, Award, Crown } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const img = (name: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/parceiros/rodrigo/${name}`;

const achievements = [
  { year: "2020-2023", title: "4x Campeão Gaúcho de Motocross", category: "MX3 / MX4", icon: Crown },
  { year: "2024", title: "Campeão Sul Brasileiro MX3", category: "", icon: Trophy },
  { year: "2024", title: "Campeão Sul Brasileiro Intermediária MX1", category: "", icon: Medal },
  { year: "2024", title: "Campeão Sul Brasileiro MX4", category: "", icon: Star },
  { year: "2023", title: "Campeão Sul Brasileiro VX", category: "Velocross", icon: Flame },
  { year: "2025", title: "3º Lugar Brasileiro de Motocross", category: "MX4", icon: Award },
  { year: "2017-2019", title: "Tricampeão Regional de Motocross", category: "", icon: Flag },
  { year: "2025", title: "4 Vitórias Abertura Pro Honda", category: "", icon: Zap },
  { year: "2022", title: "Campeão Gaúcho de Velocross", category: "VX", icon: Trophy },
];

const parallaxImages = [
  { src: img("foto1.jpg"), alt: "Rodrigo Galiotto em ação no motocross" },
  { src: img("foto2.jpg"), alt: "Rodrigo Galiotto manobra de motocross" },
  { src: img("foto3.jpg"), alt: "Rodrigo Galiotto salto de motocross" },
  { src: img("foto4.jpg"), alt: "Rodrigo Galiotto no pódio" },
  { src: img("foto5.jpg"), alt: "Rodrigo Galiotto com produtos MOTOREX" },
];

/* ─── Floating MX Icons ─── */
const FloatingIcons = () => {
  const icons = [Bike, Flag, Gauge, Shield, Target, Crown, Award, Timer];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((Icon, i) => (
        <div
          key={i}
          className="absolute text-primary/[0.06] animate-pulse"
          style={{
            top: `${8 + (i * 13) % 80}%`,
            left: `${5 + (i * 17) % 90}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        >
          <Icon size={28 + (i % 3) * 12} strokeWidth={1} />
        </div>
      ))}
    </div>
  );
};

/* ─── Dust Particles ─── */
const DustParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary/20"
        style={{
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float-particle ${4 + Math.random() * 6}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

/* ─── Race Number Plate ─── */
const RaceNumberPlate = ({ number, className = "" }: { number: string; className?: string }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <div className="relative bg-primary/10 border-2 border-primary/30 rounded-lg px-6 py-3 skew-x-[-6deg]"
      style={{ boxShadow: '0 0 20px hsl(197 100% 43.7% / 0.2), inset 0 0 15px hsl(197 100% 43.7% / 0.05)' }}>
      <span className="font-heading text-3xl md:text-4xl font-bold text-primary skew-x-[6deg] inline-block drop-shadow-[0_0_10px_hsl(197_100%_43.7%/0.5)]">
        #{number}
      </span>
    </div>
  </div>
);

/* ─── HUD Corner Brackets ─── */
const HUDCorners = () => (
  <>
    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-sm" />
    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/30 rounded-tr-sm" />
    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/30 rounded-bl-sm" />
    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-sm" />
  </>
);

/* ─── HUD Overlay (game-style top bar) ─── */
const HUDOverlay = () => (
  <div className="absolute top-4 left-4 right-4 z-30 hidden md:flex justify-between items-start pointer-events-none">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-secondary/60 backdrop-blur-md border border-primary/20 rounded px-3 py-1.5"
        style={{ boxShadow: '0 0 15px hsl(197 100% 43.7% / 0.1)' }}>
        <Flag className="w-3.5 h-3.5 text-primary" />
        <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-primary">Piloto Ativo</span>
      </div>
      <div className="flex items-center gap-2 bg-secondary/60 backdrop-blur-md border border-primary/20 rounded px-3 py-1.5">
        <Gauge className="w-3.5 h-3.5 text-primary/60" />
        <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-secondary-foreground/40">MX · 450cc</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2 bg-secondary/60 backdrop-blur-md border border-primary/20 rounded px-3 py-1.5">
        <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-primary/60">Rank</span>
        <Crown className="w-3.5 h-3.5 text-primary" />
      </div>
      <RaceNumberPlate number="720" />
    </div>
  </div>
);

/* ─── Checkpoint Divider ─── */
const CheckpointDivider = ({ label }: { label: string }) => (
  <div className="relative py-4 md:py-8 overflow-hidden">
    <div className="flex items-center justify-center gap-4">
      <div className="h-[2px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-primary/40" />
      <div className="flex items-center gap-2 bg-secondary/80 border border-primary/20 rounded px-4 py-2"
        style={{ boxShadow: '0 0 20px hsl(197 100% 43.7% / 0.15)' }}>
        <Flag className="w-3.5 h-3.5 text-primary" />
        <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-primary">{label}</span>
      </div>
      <div className="h-[2px] flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-primary/40" />
    </div>
    <div className="hidden md:flex items-center justify-center gap-0.5 mt-3 opacity-15">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="w-1 h-4 bg-primary/60 rounded-full"
          style={{ transform: `rotate(${i % 2 === 0 ? 12 : -12}deg)`, opacity: 0.3 + Math.random() * 0.7 }}
        />
      ))}
    </div>
  </div>
);

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
    <div ref={ref} className="relative min-h-[60vh] md:min-h-screen overflow-hidden flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
        style={{ transform: `translateY(${offset}px)` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-40" />
      <DustParticles />
      {children && <div className="relative z-10 w-full">{children}</div>}
    </div>
  );
};

/* ─── Animated Counter ─── */
const Counter = ({ target, label, icon: Icon }: { target: string; label: string; icon?: React.ElementType }) => {
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
    <div ref={ref} className="text-center relative group">
      {Icon && <Icon className="w-5 h-5 text-primary/30 mx-auto mb-2 group-hover:text-primary/60 transition-colors duration-300" />}
      <div className="font-heading text-4xl md:text-6xl font-bold text-primary drop-shadow-[0_0_20px_hsl(197_100%_43.7%/0.4)]">
        {isNumber ? count : target}
      </div>
      <div className="text-secondary-foreground/50 text-xs font-heading uppercase tracking-[0.2em] mt-2">
        {label}
      </div>
    </div>
  );
};

/* ─── Speed Lines Background ─── */
const SpeedLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent"
        style={{
          top: `${5 + i * 8}%`,
          left: `-10%`,
          right: `-10%`,
          animationDelay: `${i * 0.25}s`,
          animationDuration: `${2 + i * 0.4}s`,
          transform: `rotate(${-2 + i * 0.4}deg)`,
          animation: `speed-line ${2 + i * 0.3}s ease-in-out infinite`,
        }}
      />
    ))}
  </div>
);

/* ─── MX Roost Spray (dirt splash) ─── */
const RoostSpray = ({ side = "left" }: { side?: "left" | "right" }) => (
  <div className={`absolute bottom-0 ${side === "left" ? "left-0" : "right-0"} pointer-events-none opacity-50`}>
    <svg width="350" height="200" viewBox="0 0 350 200" className="text-primary w-[200px] h-[120px] md:w-[350px] md:h-[200px]">
      {Array.from({ length: 40 }).map((_, i) => (
        <circle
          key={i}
          cx={20 + Math.random() * 310}
          cy={180 - Math.random() * 150}
          r={2 + Math.random() * 6}
          fill="currentColor"
          opacity={0.3 + Math.random() * 0.6}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={`e${i}`}
          cx={30 + Math.random() * 290}
          cy={170 - Math.random() * 120}
          rx={4 + Math.random() * 8}
          ry={2 + Math.random() * 4}
          fill="currentColor"
          opacity={0.2 + Math.random() * 0.4}
          transform={`rotate(${-30 + Math.random() * 60} ${30 + Math.random() * 290} ${170 - Math.random() * 120})`}
        />
      ))}
    </svg>
  </div>
);

const RodrigoGaliotto = () => {
  return (
    <div className="bg-secondary text-secondary-foreground">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[80vh] md:h-screen max-h-[1080px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={img("rodrigoRT.png")}
            alt="Rodrigo Galiotto"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-secondary/95 via-secondary/40 to-transparent" />
        </div>

        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <SpeedLines />
        <DustParticles />
        <FloatingIcons />
        <HUDOverlay />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-secondary/60 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
              style={{ boxShadow: '0 0 20px hsl(197 100% 43.7% / 0.2)' }}>
              <span className="text-primary/80 text-[10px] font-heading uppercase tracking-[0.3em]">Scroll</span>
              <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
            </div>
          </div>
        </div>

        <div className="relative container pb-16 md:pb-28 pt-24 md:pt-32 z-10 flex flex-col items-center text-center md:items-end md:text-right">
          <Link
            to="/parceiros"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-heading uppercase tracking-wider mb-6 md:mb-8 hover:gap-3 transition-all duration-300 min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" /> Parceiros
          </Link>

          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 mb-4 md:justify-end">
              <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-heading uppercase tracking-wider px-3 py-1.5 btn-clip min-h-[44px] flex items-center"
                style={{ boxShadow: '0 0 15px hsl(197 100% 43.7% / 0.3)' }}>
                <Bike className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Parceiro RT Brasil
              </span>
              <span className="bg-primary/10 border border-primary/30 text-primary text-[10px] font-heading uppercase tracking-wider px-2.5 py-1.5 rounded flex items-center gap-1.5 min-h-[44px]">
                <Shield className="w-3 h-3" /> Piloto Veterano
              </span>
              <a
                href="https://instagram.com/galiotto.720"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-secondary-foreground/40 text-xs hover:text-primary transition-colors min-h-[44px]"
              >
                <Instagram className="w-3.5 h-3.5" /> @galiotto.720
              </a>
            </div>

            <h1 className="font-heading text-[36px] md:text-[100px] lg:text-[130px] uppercase font-bold leading-[0.85] mb-4 md:mb-6">
              Rodrigo
              <br />
              <span className="text-gradient drop-shadow-[0_0_40px_hsl(197_100%_43.7%/0.3)]">Galiotto</span>
            </h1>

            <p className="text-secondary-foreground/60 text-base md:text-xl max-w-xl leading-relaxed md:ml-auto">
              Com mais de 15 anos de carreira,{" "}
              <strong className="text-secondary-foreground">4x Campeão Gaúcho</strong> e múltiplo campeão Sul Brasileiro.
              A força do motocross gaúcho no cenário nacional.
            </p>
          </AnimateOnScroll>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ boxShadow: '0 0 20px hsl(197 100% 43.7% / 0.4)' }} />
      </section>

      {/* ═══════════ STATS BAR — Game HUD Style ═══════════ */}
      <section className="relative z-10 py-12 md:py-16">
        <SpeedLines />
        <FloatingIcons />
        <div className="container">
          <AnimateOnScroll animation="fade-up" delay={200}>
            <div className="liquid-glass rounded-lg p-4 md:p-8 lg:p-12 relative overflow-hidden">
              <HUDCorners />
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(197 100% 43.7% / 0.02) 2px, hsl(197 100% 43.7% / 0.02) 4px)',
                }} />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
                <Counter target="12" label="Títulos" icon={Trophy} />
                <Counter target="🥇" label="Medalhas" icon={Medal} />
                <Counter target="3" label="Modalidades" icon={Target} />
                <Counter target="MX4" label="Categoria" icon={Bike} />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <CheckpointDivider label="Checkpoint 01" />

      {/* ═══════════ PARALLAX IMAGE 1 ═══════════ */}
      <ParallaxSection
        src={parallaxImages[0].src}
        alt={parallaxImages[0].alt}
        overlay="from-secondary via-transparent to-secondary"
      >
        <div className="container text-center py-20 relative">
          <RoostSpray side="left" />
          <RoostSpray side="right" />
          <AnimateOnScroll animation="scale-in">
            <div className="relative inline-block">
              <Bike className="w-10 h-10 md:w-14 md:h-14 text-primary/40 mx-auto mb-4 drop-shadow-[0_0_20px_hsl(197_100%_43.7%/0.3)]" />
              <span
                className="font-heading text-[28px] md:text-[80px] lg:text-[100px] uppercase font-bold leading-none text-primary/60 block"
                style={{ textShadow: '0 0 40px hsl(197 100% 43.7% / 0.6), 0 0 80px hsl(197 100% 43.7% / 0.3)' }}
              >
                BORN TO RIDE
              </span>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Flag className="w-4 h-4 text-primary/50" />
                <div className="h-[1px] w-20 bg-primary/30" />
                <span className="text-primary/60 text-xs font-heading uppercase tracking-[0.3em]">Since 2010</span>
                <div className="h-[1px] w-20 bg-primary/30" />
                <Flag className="w-4 h-4 text-primary/50" />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      {/* ═══════════ ACHIEVEMENTS — Unlock Screen Style ═══════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SpeedLines />
        <FloatingIcons />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/[0.03] to-transparent skew-x-[-12deg] translate-x-20" />
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-r from-primary/[0.02] to-transparent skew-x-[12deg] -translate-x-10" />

        <div className="container relative">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center gap-4 justify-center mb-2">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-primary/50" />
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">Conquistas Desbloqueadas</span>
              <Trophy className="w-4 h-4 text-primary" />
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h2 className="font-heading text-[36px] md:text-[56px] uppercase font-bold text-center mb-4 leading-none">
              Premiações
            </h2>
            <p className="text-center text-secondary-foreground/30 text-xs font-heading uppercase tracking-[0.2em] mb-12">
              <Star className="w-3 h-3 inline mr-1 text-primary/50" />
              9 / 9 Achievements Unlocked
              <Star className="w-3 h-3 inline ml-1 text-primary/50" />
            </p>
          </AnimateOnScroll>

          <div className="max-w-3xl mx-auto space-y-4">
            {achievements.map((a, i) => (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="glass-card rounded-lg p-4 md:p-6 flex items-center gap-3 md:gap-4 group hover:translate-x-2 transition-all duration-500 relative overflow-hidden">
                  <HUDCorners />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 relative"
                    style={{ boxShadow: '0 0 15px hsl(197 100% 43.7% / 0.1)' }}>
                    <a.icon className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-[0_0_8px_hsl(197_100%_43.7%/0.4)]" />
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <h3 className="font-heading text-base md:text-xl uppercase font-bold leading-tight">
                      🥇 {a.title}
                    </h3>
                    <p className="text-secondary-foreground/50 text-xs md:text-sm flex items-center gap-2">
                      <Timer className="w-3 h-3 text-primary/40" />
                      {a.year}
                      {a.category ? ` — ${a.category}` : ""}
                    </p>
                  </div>
                  <div className="hidden md:block text-primary font-heading text-3xl font-bold opacity-10 group-hover:opacity-40 transition-opacity duration-500 relative">
                    {a.year}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CheckpointDivider label="Checkpoint 02" />

      {/* ═══════════ PARALLAX IMAGE 2 ═══════════ */}
      <ParallaxSection
        src={parallaxImages[1].src}
        alt={parallaxImages[1].alt}
        overlay="from-secondary via-secondary/20 to-secondary"
      >
        <div className="container text-center py-20 relative">
          <RoostSpray side="left" />
          <RoostSpray side="right" />
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gauge className="w-5 h-5 text-primary/50 drop-shadow-[0_0_10px_hsl(197_100%_43.7%/0.3)]" />
              <div className="h-[1px] w-12 bg-primary/30" />
              <Zap className="w-5 h-5 text-primary/50 drop-shadow-[0_0_10px_hsl(197_100%_43.7%/0.3)]" />
            </div>
            <h2 className="font-heading text-[36px] md:text-[56px] uppercase font-bold leading-none mb-4">
              Experiência & <span className="text-gradient">Garra</span>
            </h2>
            <p className="text-secondary-foreground/50 max-w-md mx-auto">
              15 anos de pista moldaram um piloto resiliente, técnico e implacável em qualquer terreno.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      {/* ═══════════ ABOUT / BIO — Player Profile Card ═══════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <SpeedLines />
        <FloatingIcons />
        <div className="container">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 items-center">
            <AnimateOnScroll animation="fade-in-left" className="md:col-span-2">
              <div className="relative rounded-lg overflow-hidden aspect-[3/4] group">
                <img
                  src={img("rodrigoRT.png")}
                  alt="Rodrigo Galiotto - Piloto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />
                <div className="absolute inset-0 rounded-lg border border-primary/10 group-hover:border-primary/30 transition-colors duration-500"
                  style={{ boxShadow: 'inset 0 0 30px hsl(197 100% 43.7% / 0.05)' }} />
                <HUDCorners />
                <div className="absolute top-5 left-5 bg-secondary/70 backdrop-blur-md border border-primary/20 rounded px-3 py-1.5 flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-primary" />
                  <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-primary">Veterano</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <RaceNumberPlate number="720" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{ boxShadow: '0 0 15px hsl(197 100% 43.7% / 0.3)' }} />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-in-right" className="md:col-span-3">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-[1px] w-10 bg-primary/50" />
                  <Bike className="w-4 h-4 text-primary/60" />
                  <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">Player Profile</span>
                </div>
                <h2 className="font-heading text-[36px] md:text-[48px] uppercase font-bold leading-none mb-6">
                  Quem é <span className="text-gradient">Rodrigo</span>
                </h2>

                {/* Stat bars */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Velocidade", value: 88, icon: Gauge },
                    { label: "Técnica", value: 92, icon: Target },
                    { label: "Resistência", value: 95, icon: Shield },
                    { label: "Coragem", value: 90, icon: Flame },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-secondary/60 border border-primary/10 rounded px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-heading uppercase tracking-wider text-secondary-foreground/40 flex items-center gap-1">
                          <stat.icon className="w-3 h-3 text-primary/40" />
                          {stat.label}
                        </span>
                        <span className="text-xs font-heading font-bold text-primary">{stat.value}</span>
                      </div>
                      <div className="h-1.5 bg-secondary/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                          style={{ width: `${stat.value}%`, boxShadow: '0 0 8px hsl(197 100% 43.7% / 0.4)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-secondary-foreground/60 leading-relaxed text-base md:text-lg">
                  <p>
                    Natural de <strong className="text-secondary-foreground">Flores da Cunha, Rio Grande do Sul</strong>,
                    Rodrigo Galiotto é um dos nomes mais consistentes do motocross gaúcho. Com mais de 15 anos
                    de carreira nas pistas, o piloto #720 construiu uma trajetória marcada por determinação e
                    conquistas em múltiplas categorias.
                  </p>
                  <p>
                    <strong className="text-primary">4x Campeão Gaúcho de Motocross</strong> nas categorias MX3 e MX4,
                    Rodrigo também domina o cenário Sul Brasileiro — com títulos nas categorias{" "}
                    <strong className="text-primary">MX3, Intermediária MX1, MX4 e Velocross (VX)</strong>.
                    Em 2025, conquistou o{" "}
                    <strong className="text-primary">3º lugar no Brasileiro de Motocross na MX4</strong>,
                    consolidando sua presença no topo do cenário nacional.
                  </p>
                  <p>
                    Versátil e incansável, Rodrigo compete em Motocross e Velocross, sempre representando
                    a força da família Galiotto — com seu irmão Marcello também como piloto ativo.
                    Pilotando Honda com apoio da RT Brasil e MOTOREX, Rodrigo prova que experiência
                    e dedicação são armas imbatíveis nas pistas.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://instagram.com/galiotto.720"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="btn-clip hover-glow text-base px-6 py-3 min-h-[44px] w-full md:w-auto"
                      style={{ boxShadow: '0 0 20px hsl(197 100% 43.7% / 0.2)' }}>
                      <Instagram className="w-4 h-4 mr-2" /> Seguir no Instagram
                    </Button>
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <CheckpointDivider label="Finish Line" />

      {/* ═══════════ PARALLAX IMAGE 3 ═══════════ */}
      <ParallaxSection
        src={parallaxImages[2].src}
        alt={parallaxImages[2].alt}
        overlay="from-secondary via-secondary/30 to-secondary"
      >
        <div className="container text-center py-20 relative">
          <RoostSpray side="left" />
          <RoostSpray side="right" />
          <AnimateOnScroll animation="scale-in">
            <div className="relative inline-block">
              <Flag className="w-10 h-10 md:w-14 md:h-14 text-primary/40 mx-auto mb-4 drop-shadow-[0_0_20px_hsl(197_100%_43.7%/0.3)]" />
              <span
                className="font-heading text-[28px] md:text-[80px] lg:text-[100px] uppercase font-bold leading-none text-primary/60 block"
                style={{ textShadow: '0 0 40px hsl(197 100% 43.7% / 0.6), 0 0 80px hsl(197 100% 43.7% / 0.3)' }}
              >
                FULL THROTTLE
              </span>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Gauge className="w-4 h-4 text-primary/50" />
                <span className="text-primary/60 text-xs font-heading uppercase tracking-[0.3em]">Max Power</span>
                <Zap className="w-4 h-4 text-primary/50" />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      <CheckpointDivider label="Checkpoint 04" />

      {/* ═══════════ PARALLAX IMAGE 4 — foto4 ═══════════ */}
      <ParallaxSection
        src={parallaxImages[3].src}
        alt={parallaxImages[3].alt}
        overlay="from-secondary via-secondary/30 to-secondary"
      >
        <div className="container text-center py-20 relative">
          <RoostSpray side="left" />
          <RoostSpray side="right" />
          <AnimateOnScroll animation="scale-in">
            <div className="relative inline-block">
              <Crown className="w-10 h-10 md:w-14 md:h-14 text-primary/40 mx-auto mb-4 drop-shadow-[0_0_20px_hsl(197_100%_43.7%/0.3)]" />
              <span
                className="font-heading text-[28px] md:text-[80px] lg:text-[100px] uppercase font-bold leading-none text-primary/60 block"
                style={{ textShadow: '0 0 40px hsl(197 100% 43.7% / 0.6), 0 0 80px hsl(197 100% 43.7% / 0.3)' }}
              >
                UNSTOPPABLE
              </span>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-primary/50" />
                <span className="text-primary/60 text-xs font-heading uppercase tracking-[0.3em]">Next Level</span>
                <Star className="w-4 h-4 text-primary/50" />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      <CheckpointDivider label="Checkpoint 05" />

      {/* ═══════════ PARALLAX IMAGE 5 — Motorex Section ═══════════ */}
      <ParallaxSection
        src={parallaxImages[4].src}
        alt={parallaxImages[4].alt}
        overlay="from-secondary via-secondary/40 to-secondary"
      >
        <div className="container py-20 relative">
          <RoostSpray side="left" />
          <AnimateOnScroll animation="fade-up">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center gap-4 justify-center mb-6">
                <div className="h-[1px] w-12 bg-primary/50" />
                <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">Powered By</span>
                <div className="h-[1px] w-12 bg-primary/50" />
              </div>
              <h2 className="font-heading text-[36px] md:text-[56px] uppercase font-bold leading-none mb-6">
                Potência com{" "}
                <span className="text-gradient">MOTOREX</span>
              </h2>
              <p className="text-secondary-foreground/60 text-base md:text-lg leading-relaxed mb-4">
                Rodrigo confia na tecnologia suíça MOTOREX para extrair o máximo de performance da sua Honda 450cc. Com mais de 100 anos de expertise, a MOTOREX é a escolha dos campeões mundiais.
              </p>
              <p className="text-secondary-foreground/50 text-sm md:text-base leading-relaxed mb-8">
                Desde lubrificantes de motor até produtos de limpeza e manutenção, cada detalhe conta na busca pela vitória. A linha MOTOREX garante proteção, rendimento e durabilidade superiores — exatamente o que um piloto veterano precisa para manter a competitividade no mais alto nível.
              </p>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center">
                <div className="glass-card rounded-lg px-5 py-3 flex items-center gap-2 w-full md:w-auto justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-heading uppercase tracking-wider text-secondary-foreground/70">Proteção máxima</span>
                </div>
                <div className="glass-card rounded-lg px-5 py-3 flex items-center gap-2 w-full md:w-auto justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-heading uppercase tracking-wider text-secondary-foreground/70">Alta performance</span>
                </div>
                <div className="glass-card rounded-lg px-5 py-3 flex items-center gap-2 w-full md:w-auto justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-heading uppercase tracking-wider text-secondary-foreground/70">Qualidade suíça</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <SpeedLines />
        <DustParticles />
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <div className="liquid-glass rounded-lg p-6 md:p-10 lg:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
              <HUDCorners />
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(197 100% 43.7% / 0.015) 2px, hsl(197 100% 43.7% / 0.015) 4px)',
                }} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -skew-x-12 translate-x-8 -translate-y-4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 -skew-x-12 -translate-x-4 translate-y-4" />

              <div className="relative">
                <Trophy className="w-8 h-8 text-primary/50 mx-auto mb-4 drop-shadow-[0_0_15px_hsl(197_100%_43.7%/0.3)]" />
                <div className="flex items-center gap-4 justify-center mb-4">
                  <div className="h-[1px] w-12 bg-primary/50" />
                  <Flag className="w-4 h-4 text-primary/60" />
                  <span className="text-primary text-xs font-heading uppercase tracking-[0.3em]">RT Brasil</span>
                  <Flag className="w-4 h-4 text-primary/60" />
                  <div className="h-[1px] w-12 bg-primary/50" />
                </div>
                <h2 className="font-heading text-[28px] md:text-[44px] uppercase font-bold leading-none mb-4">
                  Produtos utilizados por{" "}
                  <span className="text-gradient">Rodrigo</span>
                </h2>
                <p className="text-secondary-foreground/50 mb-8 max-w-md mx-auto text-base md:text-lg">
                  Conheça a linha MOTOREX escolhida por pilotos campeões como o Rodrigo Galiotto.
                </p>
                <Link to="/motorex">
                  <Button className="btn-clip hover-glow text-base px-10 py-4 min-h-[44px] w-full md:w-auto"
                    style={{ boxShadow: '0 0 25px hsl(197 100% 43.7% / 0.3)' }}>
                    <Bike className="w-4 h-4 mr-2" /> Ver produtos MOTOREX
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

export default RodrigoGaliotto;
