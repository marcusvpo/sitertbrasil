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
      {/* ── Header ── */}
      <section className="relative py-16 md:py-24 overflow-hidden mesh-gradient">
        <div className="container relative z-10 text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">Suporte</span>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold mt-3 mb-5 leading-[0.9]">
              Central de <span className="text-gradient">Atendimento</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Estamos prontos para ajudar. Escolha o canal de sua preferência ou envie uma mensagem direta.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Contact Cards — gradient borders ── */}
      <section className="py-10 md:py-16 border-t border-foreground/[0.04]">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactCards.map((c, i) => (
              <AnimateOnScroll key={c.label} animation="scale-in" delay={i * 100}>
                <div className="gradient-border rounded-xl p-7 text-center hover:shadow-[0_0_30px_hsl(197_100%_43.7%/0.1)] transition-all duration-500 h-full">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <c.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold mb-1">{c.label}</h3>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">{c.value}</p>
                  )}
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="relative py-12 md:py-20 border-t border-foreground/[0.04] mesh-gradient">
        <div className="container relative z-10 max-w-xl">
          <AnimateOnScroll className="text-center mb-10">
            <Send size={32} className="mx-auto text-primary mb-4" />
            <h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-bold">Fale Conosco</h2>
          </AnimateOnScroll>

          {submitted ? (
            <AnimateOnScroll animation="scale-in">
              <div className="text-center py-16">
                <CheckCircle className="mx-auto text-primary mb-4" size={48} />
                <h3 className="font-heading text-xl font-bold mb-2">Mensagem enviada!</h3>
                <p className="text-muted-foreground">Retornaremos o mais breve possível.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <AnimateOnScroll animation="fade-up">
              <form onSubmit={handleSubmit} className="gradient-border rounded-xl p-7 md:p-10 space-y-5 bg-foreground/[0.02]">
                <div className="neon-focus rounded-md">
                  <Label htmlFor="nome" className="text-foreground/80 text-sm mb-1.5 block">Nome</Label>
                  <Input id="nome" name="nome" placeholder="Seu nome" required className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="email" className="text-foreground/80 text-sm mb-1.5 block">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="whatsapp" className="text-foreground/80 text-sm mb-1.5 block">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="mensagem" className="text-foreground/80 text-sm mb-1.5 block">Como podemos te ajudar?</Label>
                  <Textarea id="mensagem" name="mensagem" placeholder="Descreva sua dúvida ou solicitação..." required className="bg-muted/30 border-foreground/10" rows={5} />
                </div>
                <Button type="submit" className="w-full font-heading uppercase tracking-wider border-beam hover-glow">
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
