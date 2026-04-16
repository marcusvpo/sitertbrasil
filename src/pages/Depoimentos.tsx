import { Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const depoimentos = [
  { name: "André Ferreira", role: "Piloto Profissional", stars: 5, text: "Desde que comecei a usar MOTOREX, minha moto nunca teve tanta performance. Produto de qualidade incomparável." },
  { name: "Carla Nunes", role: "Revendedora – MG", stars: 5, text: "A RT Brasil entrega rápido e o suporte é excelente. Meus clientes amam a MOTOREX." },
  { name: "João Marques", role: "Mecânico Especialista", stars: 5, text: "Trabalho com diversas marcas, mas a MOTOREX é a que mais confio para motores de alta performance." },
  { name: "Lucas Mendes", role: "Piloto Amador – SP", stars: 5, text: "Qualidade indiscutível. Meu motor roda mais suave e a proteção é muito superior ao que eu usava antes." },
  { name: "Fernanda Lima", role: "Lojista – PR", stars: 5, text: "Os clientes pedem por MOTOREX. A marca vende praticamente sozinha pela reputação." },
  { name: "Ricardo Santos", role: "Preparador de Motos", stars: 5, text: "Em bancada, os números não mentem. A viscosidade se mantém estável mesmo em temperaturas extremas." },
  { name: "Thiago Costa", role: "Piloto de Enduro", stars: 4, text: "Uso nos treinos e nas competições. A diferença no câmbio é nítida — muito mais preciso." },
  { name: "Marina Rocha", role: "Revendedora – SC", stars: 5, text: "Suporte técnico da RT Brasil é impecável. Sempre prontos a ajudar com dúvidas sobre aplicação." },
  { name: "Pedro Almeida", role: "Mecânico – RJ", stars: 5, text: "Meus clientes voltam pedindo MOTOREX. Isso diz tudo sobre a qualidade do produto." },
];

const row1 = depoimentos.slice(0, 5);
const row2 = depoimentos.slice(5);

const TestimonialCard = ({ d }: { d: typeof depoimentos[0] }) => (
  <div className="gradient-border rounded-lg p-6 w-[340px] flex-shrink-0 h-full flex flex-col">
    <div className="flex gap-1 mb-3">
      {Array.from({ length: d.stars }).map((_, si) => (
        <Star key={si} size={14} className="fill-primary text-primary" />
      ))}
      {Array.from({ length: 5 - d.stars }).map((_, si) => (
        <Star key={`e-${si}`} size={14} className="text-foreground/15" />
      ))}
    </div>
    <p className="text-foreground/70 text-sm leading-relaxed mb-4 italic flex-1">
      "{d.text}"
    </p>
    <div className="flex items-center gap-3 pt-3 border-t border-foreground/[0.06]">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="font-heading text-primary font-bold text-xs">
          {d.name.split(" ").map(n => n[0]).join("")}
        </span>
      </div>
      <div>
        <p className="font-heading text-sm font-semibold">{d.name}</p>
        <p className="text-xs text-muted-foreground">{d.role}</p>
      </div>
    </div>
  </div>
);

const Depoimentos = () => (
  <>
    {/* ── Header ── */}
    <section className="relative py-16 md:py-24 mesh-gradient">
      <div className="container relative z-10 text-center">
        <AnimateOnScroll animation="blur-in">
          <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Depoimentos</span>
          <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold mt-3 mb-5 leading-[0.9]">
            O que dizem sobre a <span className="text-gradient">MOTOREX</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pilotos, mecânicos e revendedores compartilham suas experiências com os produtos MOTOREX distribuídos pela RT Brasil.
          </p>
        </AnimateOnScroll>
      </div>
    </section>

    {/* ── Sliding Row 1 — Tilted ── */}
    <section className="py-4 overflow-hidden" style={{ transform: "rotate(-2deg)" }}>
      <div className="pause-on-hover">
        <div className="marquee-track flex gap-6 animate-marquee" style={{ width: "max-content" }}>
          {[...row1, ...row1, ...row1].map((d, i) => (
            <TestimonialCard key={i} d={d} />
          ))}
        </div>
      </div>
    </section>

    {/* ── Sliding Row 2 — Tilted reverse ── */}
    <section className="py-4 overflow-hidden" style={{ transform: "rotate(-2deg)" }}>
      <div className="pause-on-hover">
        <div className="marquee-track flex gap-6 animate-marquee-reverse" style={{ width: "max-content" }}>
          {[...row2, ...row2, ...row2, ...row2].map((d, i) => (
            <TestimonialCard key={i} d={d} />
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="relative py-16 md:py-24 border-t border-foreground/[0.04] mesh-gradient">
      <div className="container relative z-10 text-center">
        <AnimateOnScroll>
          <div className="gradient-border rounded-xl p-10 md:p-14 max-w-xl mx-auto">
            <MessageCircle size={40} className="mx-auto text-primary mb-5" />
            <h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-3">
              Tem um depoimento?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Compartilhe sua experiência com produtos MOTOREX e ajude outros a conhecerem a marca.
            </p>
            <Button asChild size="lg" className="font-heading uppercase tracking-wider border-beam hover-glow">
              <a
                href="https://wa.me/5516997964255?text=Olá! Gostaria de deixar um depoimento sobre os produtos MOTOREX."
                target="_blank"
                rel="noopener noreferrer"
              >
                Enviar Depoimento via WhatsApp
              </a>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  </>
);

export default Depoimentos;
