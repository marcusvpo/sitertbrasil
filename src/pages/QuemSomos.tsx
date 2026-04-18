import { Link } from "react-router-dom";
import { ArrowRight, Globe, Award, Calendar, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const timeline = [
  { year: "1917", text: "Fundação da MOTOREX na Suíça — mais de um século de inovação.", icon: Calendar },
  { year: "1960", text: "Primeiros contratos com equipes de competição internacionais.", icon: Award },
  { year: "2000", text: "Expansão global — presente em mais de 60 países.", icon: Globe },
  { year: "2018", text: "RT Brasil inicia distribuição oficial no mercado brasileiro.", icon: Award },
  { year: "2024", text: "Rede de revendedores em expansão por todo o território nacional.", icon: Users },
];

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
              RT Brasil + <span className="text-motorex">MOTOREX</span>
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              A RT Brasil é a distribuidora oficial da <span className="text-motorex font-semibold">MOTOREX</span> no Brasil, trazendo lubrificantes de alta performance com tecnologia suíça para pilotos, mecânicos e apaixonados por motocross.
            </p>
            <p className="text-muted-foreground/50 text-sm mt-4">
              Rt Brasil Importação e Comércio — CNPJ: 00.913.926/0001-78
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Timeline Roadmap ── */}
      <section className="py-16 md:py-24 border-t border-foreground/[0.04]">
        <div className="container">
          <AnimateOnScroll className="text-center mb-16">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Trajetória</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">Nossa História</h2>
          </AnimateOnScroll>

          {/* Vertical Roadmap */}
          <div className="relative max-w-3xl mx-auto">
            {/* Central line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-motorex/0 via-motorex/40 to-motorex/0 md:-translate-x-px" />

            {timeline.map((item, i) => {
              const Icon = item.icon;
              const isEven = i % 2 === 0;
              return (
                <AnimateOnScroll key={item.year} animation="fade-up" delay={i * 100}>
                  <div className={`relative flex items-start gap-6 mb-12 last:mb-0 md:gap-0 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}>
                    {/* Content card */}
                    <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isEven ? "md:pr-0 md:text-right" : "md:pl-0 md:text-left"
                    }`}>
                      <div className="gradient-border rounded-xl p-5 hover:shadow-[0_0_30px_hsl(var(--motorex)/0.1)] transition-all duration-500">
                        <span className="font-heading text-2xl md:text-3xl font-bold text-motorex block mb-2">
                          {item.year}
                        </span>
                        <p className="text-foreground/70 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-2 border-motorex flex items-center justify-center z-10 shadow-[0_0_20px_hsl(var(--motorex)/0.3)]">
                      <Icon size={18} className="text-motorex" />
                    </div>

                    {/* Spacer for opposite side (desktop) */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-20 md:py-28 section-motorex-glow-intense">
        <div className="container relative z-10">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-white/80 text-xs tracking-[0.3em]">Números</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2 text-white"><span className="text-white">MOTOREX</span> no Mundo</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <AnimateOnScroll key={s.label} animation="scale-in" delay={i * 100}>
                <div className="bg-white/10 border border-white/20 text-center p-8 rounded-xl">
                  <s.icon size={28} className="mx-auto text-white mb-4" />
                  <span className="font-heading text-4xl md:text-5xl font-bold text-white block">
                    {s.value}
                  </span>
                  <span className="text-white/70 text-sm mt-2 block">{s.label}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 md:py-24 border-t border-foreground/[0.04]">
        <div className="container">
          <AnimateOnScroll className="text-center mb-12">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Filosofia</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">Nossos Valores</h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 100}>
                <div className="gradient-border p-7 rounded-xl text-center hover:shadow-[0_0_30px_hsl(var(--motorex)/0.1)] transition-all duration-500 h-full">
                  <div className="w-14 h-14 rounded-full bg-motorex/10 flex items-center justify-center mx-auto mb-5">
                    <v.icon size={24} className="text-motorex" />
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
      <section className="relative py-16 md:py-24">
        <div className="container relative z-10 text-center">
          <AnimateOnScroll>
            <div className="gradient-border rounded-xl p-10 md:p-14 max-w-xl mx-auto">
              <h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-4">
                Quer fazer parte da rede <span className="text-motorex">MOTOREX</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Cadastre-se como revendedor e leve produtos de alta performance para sua região.
              </p>
              <Button asChild size="lg" className="font-heading uppercase tracking-wider bg-motorex hover:bg-motorex/90 text-white border-beam hover-glow">
                <Link to="/seja-revendedor">Seja Revendedor <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
      </div>
    </div>
  );
};

export default QuemSomos;
