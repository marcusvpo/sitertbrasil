import { Link } from "react-router-dom";
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

const Depoimentos = () => (
  <>
    {/* Header */}
    <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
      <div className="container text-center">
        <AnimateOnScroll animation="blur-in">
          <span className="font-heading uppercase text-primary text-sm tracking-[0.25em]">Depoimentos</span>
          <h1 className="font-heading text-4xl md:text-5xl uppercase font-bold mt-3 mb-4">
            O que dizem sobre a <span className="text-gradient">MOTOREX</span>
          </h1>
          <p className="text-secondary-foreground/60 max-w-xl mx-auto">
            Pilotos, mecânicos e revendedores compartilham suas experiências com os produtos MOTOREX distribuídos pela RT Brasil.
          </p>
        </AnimateOnScroll>
      </div>
    </section>

    {/* Grid */}
    <section className="bg-secondary text-secondary-foreground py-12 md:py-20 border-t border-secondary-foreground/5">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {depoimentos.map((d, i) => (
            <AnimateOnScroll key={d.name} animation="fade-up" delay={(i % 3) * 120}>
              <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-6 hover-lift transition-all duration-300 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: d.stars }).map((_, si) => (
                    <Star key={si} size={14} className="fill-primary text-primary" />
                  ))}
                  {Array.from({ length: 5 - d.stars }).map((_, si) => (
                    <Star key={si} size={14} className="text-secondary-foreground/20" />
                  ))}
                </div>
                <p className="text-secondary-foreground/80 text-sm leading-relaxed mb-4 italic flex-1">
                  "{d.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-secondary-foreground/10">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading text-primary font-bold text-sm">
                      {d.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading uppercase text-sm font-semibold">{d.name}</p>
                    <p className="text-xs text-secondary-foreground/50">{d.role}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-secondary text-secondary-foreground py-16 md:py-24 border-t border-secondary-foreground/5">
      <div className="container text-center">
        <AnimateOnScroll>
          <MessageCircle size={40} className="mx-auto text-primary mb-4" />
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold mb-3">
            Tem um depoimento?
          </h2>
          <p className="text-secondary-foreground/60 mb-6 max-w-md mx-auto">
            Compartilhe sua experiência com produtos MOTOREX e ajude outros a conhecerem a marca.
          </p>
          <Button asChild size="lg" className="font-heading uppercase tracking-wider hover-glow">
            <Link to="/central-atendimento">Entre em contato</Link>
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  </>
);

export default Depoimentos;
