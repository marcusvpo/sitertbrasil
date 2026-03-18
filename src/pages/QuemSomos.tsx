import { Link } from "react-router-dom";
import { ArrowRight, Globe, Award, Calendar, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const timeline = [
  { year: "1917", text: "Fundação da MOTOREX na Suíça — mais de um século de inovação." },
  { year: "1960", text: "Primeiros contratos com equipes de competição internacionais." },
  { year: "2000", text: "Expansão global — presente em mais de 60 países." },
  { year: "2018", text: "RT Brasil inicia distribuição oficial no mercado brasileiro." },
  { year: "2024", text: "Rede de revendedores em expansão por todo o território nacional." },
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

const QuemSomos = () => (
  <>
    {/* Banner */}
    <section className="relative w-full overflow-hidden">
      <img src="/images/banner-quemsomos.jpg" alt="Fábrica MOTOREX na Suíça" className="w-full h-auto block" />
    </section>

    {/* Intro */}
    <section className="bg-secondary text-secondary-foreground py-10 md:py-16">
      <div className="container max-w-3xl text-center">
        <AnimateOnScroll animation="blur-in">
          <span className="font-heading uppercase text-primary text-sm tracking-[0.25em]">Quem Somos</span>
          <h1 className="font-heading text-[42px] md:text-[64px] uppercase font-bold mt-3 mb-5 leading-[0.95]">
            RT Brasil + <span className="text-gradient">MOTOREX</span>
          </h1>
          <p className="text-secondary-foreground/70 text-lg leading-relaxed">
            A RT Brasil é a distribuidora oficial da MOTOREX no Brasil, trazendo lubrificantes de alta performance com tecnologia suíça para pilotos, mecânicos e apaixonados por motocross.
          </p>
        </AnimateOnScroll>
      </div>
    </section>

    {/* Timeline */}
    <section className="bg-secondary text-secondary-foreground py-10 md:py-16 border-t border-secondary-foreground/5">
      <div className="container max-w-2xl">
        <AnimateOnScroll className="text-center mb-10">
          <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Trajetória</span>
          <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2">Nossa História</h2>
        </AnimateOnScroll>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2" />

          {timeline.map((item, i) => (
            <AnimateOnScroll
              key={item.year}
              animation={i % 2 === 0 ? "fade-in-left" : "fade-in-right"}
              delay={i * 100}
              className="relative mb-8 last:mb-0"
            >
              <div className={`flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:text-${i % 2 === 0 ? "right" : "left"}`}>
                <div className="flex-1 hidden md:block" />
                <div className="relative z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-0 md:ml-0">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                </div>
                <div className="flex-1">
                  <span className="font-heading text-primary text-2xl font-bold">{item.year}</span>
                  <p className="text-secondary-foreground/70 text-sm mt-1">{item.text}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-secondary text-secondary-foreground py-10 md:py-16 border-t border-secondary-foreground/5">
      <div className="container">
        <AnimateOnScroll className="text-center mb-10">
          <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Números</span>
          <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2">MOTOREX no Mundo</h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <AnimateOnScroll key={s.label} animation="scale-in" delay={i * 100}>
              <div className="glass-card text-center p-6 rounded-lg">
                <s.icon size={28} className="mx-auto text-primary mb-3" />
                <span className="font-heading text-3xl md:text-4xl font-bold text-gradient block">{s.value}</span>
                <span className="text-secondary-foreground/60 text-sm mt-1 block">{s.label}</span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-secondary text-secondary-foreground py-10 md:py-16 border-t border-secondary-foreground/5">
      <div className="container">
        <AnimateOnScroll className="text-center mb-10">
          <span className="font-heading uppercase text-primary text-sm tracking-[0.2em]">Filosofia</span>
          <h2 className="font-heading text-[32px] md:text-[48px] uppercase font-bold mt-2">Nossos Valores</h2>
        </AnimateOnScroll>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <AnimateOnScroll key={v.title} animation="fade-up" delay={i * 100}>
              <div className="glass-card p-6 rounded-lg text-center hover-lift hover-glow transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading uppercase text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-secondary-foreground/60 text-sm">{v.text}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-secondary text-secondary-foreground py-10 md:py-16 border-t border-secondary-foreground/5">
      <div className="container text-center">
        <AnimateOnScroll>
          <div className="liquid-glass rounded-lg p-8 md:p-12 max-w-xl mx-auto">
            <h2 className="font-heading text-[28px] md:text-[36px] uppercase font-bold mb-4">
              Quer fazer parte da rede MOTOREX?
            </h2>
            <p className="text-secondary-foreground/60 mb-6 max-w-md mx-auto">
              Cadastre-se como revendedor e leve produtos de alta performance para sua região.
            </p>
            <Button asChild size="lg" className="font-heading uppercase tracking-wider hover-glow">
              <Link to="/seja-revendedor">Seja Revendedor <ArrowRight className="ml-2" size={18} /></Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  </>
);

export default QuemSomos;
