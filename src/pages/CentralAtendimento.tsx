import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Instagram, MapPin, CheckCircle, Send } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const contactCards = [
  { icon: Phone, label: "WhatsApp", value: "(00) 00000-0000", href: "https://wa.me/5500000000000" },
  { icon: Mail, label: "E-mail", value: "contato@rtbrasil.com.br", href: "mailto:contato@rtbrasil.com.br" },
  { icon: Instagram, label: "Instagram", value: "@rtbrasil", href: "https://instagram.com/rtbrasil" },
  { icon: MapPin, label: "Endereço", value: "São Paulo, SP - Brasil", href: undefined },
];

const CentralAtendimento = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Header */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--secondary-foreground)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="container relative text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="font-heading uppercase text-primary text-sm tracking-[0.25em]">Suporte</span>
            <h1 className="font-heading text-4xl md:text-5xl uppercase font-bold mt-3 mb-4">
              Central de <span className="text-gradient">Atendimento</span>
            </h1>
            <p className="text-secondary-foreground/60 max-w-lg mx-auto">
              Estamos prontos para ajudar. Escolha o canal de sua preferência ou envie uma mensagem direta.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-secondary text-secondary-foreground py-12 md:py-16 border-t border-secondary-foreground/5">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((c, i) => (
              <AnimateOnScroll key={c.label} animation="scale-in" delay={i * 100}>
                <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-6 text-center hover-lift hover-glow transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <c.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading uppercase text-sm font-semibold mb-1">{c.label}</h3>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/70 text-sm hover:text-primary transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-secondary-foreground/70 text-sm">{c.value}</p>
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-secondary text-secondary-foreground py-16 md:py-24 border-t border-secondary-foreground/5">
        <div className="container max-w-xl">
          <AnimateOnScroll className="text-center mb-10">
            <Send size={32} className="mx-auto text-primary mb-3" />
            <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold">Fale Conosco</h2>
          </AnimateOnScroll>

          {submitted ? (
            <AnimateOnScroll animation="scale-in">
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-primary mb-4" size={48} />
                <h3 className="font-heading text-xl uppercase font-bold mb-2">Mensagem enviada!</h3>
                <p className="text-secondary-foreground/70">Retornaremos o mais breve possível.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <AnimateOnScroll animation="fade-up">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" name="nome" placeholder="Seu nome" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="mensagem">Como podemos te ajudar?</Label>
                  <Textarea id="mensagem" name="mensagem" placeholder="Descreva sua dúvida ou solicitação..." required className="mt-1" rows={5} />
                </div>
                <Button type="submit" className="w-full font-heading uppercase tracking-wider hover-glow">
                  Enviar mensagem
                </Button>
              </form>
            </AnimateOnScroll>
          )}
        </div>
      </section>
    </>
  );
};

export default CentralAtendimento;
