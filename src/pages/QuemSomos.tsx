import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Award, Calendar, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const timeline = [
  { year: "1917", text: "Fundação da MOTOREX na Suíça — mais de um século de inovação.", icon: Calendar },
  { year: "1960", text: "Primeiros contratos com equipes de competição internacionais.", icon: Trophy },
  { year: "2000", text: "Expansão global — presente em mais de 60 países.", icon: Globe },
  { year: "2018", text: "RT Brasil inicia distribuição oficial no mercado brasileiro.", icon: Award },
  { year: "2024", text: "Rede de revendedores em expansão por todo o território nacional.", icon: Users },
];

/* Placeholder for Trophy since it's not in the import */
const Trophy = Award;

const stats = [
  { value: "100+", label: "Anos de história", icon: Calendar },
  { value: "60+", label: "Países atendidos", icon: Globe },
  { value: "500+", label: "Produtos no catálogo", icon: Award },
  { value: "1000+", label: "Revendedores globais", icon: Users },
];

const values = [
  { icon: Award, title: "Excelência", text: "Produtos desenvolvidos com tecnologia suíça de ponta." },
  { icon: Heart, title: "Paixão", text: "Movidos pela paixão pelo motocross e esportes off-road." },
  { icon: Target, title: "Compromisso", text: "Entrega rápida, suporte dedicado e qualidade garantida." },
  { icon: Globe, title: "Alcance", text: "Uma rede global com presença local e atendimento personalizado." },
];

const QuemSomos = () => {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Intersection Observer to update sticky panel */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    timelineRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveTimelineIdx(idx);
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-quemsomos.jpg" alt="Fábrica MOTOREX na Suíça" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Intro ── */}
      <section className="relative py-16 md:py-24 mesh-gradient">
        <div className="container relative z-10 max-w-3xl text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Quem Somos</span>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold mt-3 mb-6 leading-[0.9]">
              RT Brasil + <span className="text-gradient">MOTOREX</span>
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              A RT Brasil é a distribuidora oficial da MOTOREX no Brasil, trazendo lubrificantes de alta performance com tecnologia suíça para pilotos, mecânicos e apaixonados por motocross.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Sticky Scroll Timeline ── */}
      <section className="py-16 md:py-24 border-t border-foreground/[0.04]">
        <div className="container">
          <AnimateOnScroll className="text-center mb-16">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Trajetória</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">Nossa História</h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left — Sticky panel */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                <div className="gradient-border rounded-xl p-8 text-center">
                  {timeline.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.year}
                        className={`transition-all duration-500 ${
                          idx === activeTimelineIdx ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                        }`}
                        style={{ position: idx === activeTimelineIdx ? "relative" : "absolute" }}
                      >
                        <Icon size={40} className="mx-auto text-primary mb-4" />
                        <span
                          className="font-heading text-[clamp(4rem,8vw,6rem)] font-bold text-gradient block leading-none"
                        >
                          {item.year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — Scrollable items */}
            <div className="space-y-0">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.year}
                    ref={(el) => { timelineRefs.current[i] = el; }}
                    className="py-16 md:py-24 first:pt-0 last:pb-0"
                  >
                    <AnimateOnScroll animation="fade-up" delay={i * 50}>
                      {/* Mobile: show year inline */}
                      <div className="md:hidden flex items-center gap-3 mb-3">
                        <Icon size={24} className="text-primary" />
                        <span className="font-heading text-3xl font-bold text-gradient">{item.year}</span>
                      </div>
                      <p className="text-foreground/70 text-lg leading-relaxed">{item.text}</p>
                    </AnimateOnScroll>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-16 md:py-24 border-t border-foreground/[0.04] mesh-gradient">
        <div className="container relative z-10">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Números</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">MOTOREX no Mundo</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <AnimateOnScroll key={s.label} animation="scale-in" delay={i * 100}>
                <div className="gradient-border text-center p-8 rounded-xl">
                  <s.icon size={28} className="mx-auto text-primary mb-4" />
                  <span
                    className="font-heading text-4xl md:text-5xl font-bold text-gradient block"
                    style={{ textShadow: "0 0 40px hsl(197 100% 43.7% / 0.2)" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-muted-foreground text-sm mt-2 block">{s.label}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values — Gradient border cards ── */}
      <section className="py-16 md:py-24 border-t border-foreground/[0.04]">
        <div className="container">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Filosofia</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">Nossos Valores</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 100}>
                <div className="gradient-border p-7 rounded-xl text-center hover:shadow-[0_0_30px_hsl(197_100%_43.7%/0.1)] transition-all duration-500 h-full">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <v.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 md:py-24 border-t border-foreground/[0.04] mesh-gradient">
        <div className="container relative z-10 text-center">
          <AnimateOnScroll>
            <div className="gradient-border rounded-xl p-10 md:p-14 max-w-xl mx-auto">
              <h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-4">
                Quer fazer parte da rede MOTOREX?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Cadastre-se como revendedor e leve produtos de alta performance para sua região.
              </p>
              <Button asChild size="lg" className="font-heading uppercase tracking-wider border-beam hover-glow">
                <Link to="/seja-revendedor">Seja Revendedor <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
};

export default QuemSomos;
