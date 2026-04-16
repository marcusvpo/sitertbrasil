import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Instagram, MapPin, CheckCircle, Send } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const contactCards = [
  { icon: Phone, label: "WhatsApp", value: "(16) 99796-4255", href: "https://wa.me/5516997964255" },
  { icon: Mail, label: "E-mail", value: "vendas@rtbrasilimport.com.br", href: "mailto:vendas@rtbrasilimport.com.br" },
  { icon: Instagram, label: "Instagram", value: "@rtbrasil.motorex", href: "https://instagram.com/rtbrasil.motorex" },
  { icon: MapPin, label: "Endereço", value: "Av. Alfeu Martini, 790 – Jaboticabal, SP", href: "https://www.google.com/maps?q=-21.250251492402167,-48.35034751806419" },
];

const CentralAtendimento = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const nome = formData.get("nome")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const whatsapp = formData.get("whatsapp")?.toString() || "";
    const mensagem = formData.get("mensagem")?.toString() || "";
    const subject = encodeURIComponent("Contato via site - Central de Atendimento");
    const body = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\nWhatsApp: ${whatsapp}\n\nMensagem:\n${mensagem}`);
    window.open(`mailto:vendas@rtbrasilimport.com.br?subject=${subject}&body=${body}`, "_self");
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
      <section className="py-12 md:py-20 section-motorex-glow-intense">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactCards.map((c, i) => (
              <AnimateOnScroll key={c.label} animation="scale-in" delay={i * 100}>
                <div className="bg-white/10 border border-white/20 rounded-xl p-7 text-center hover:bg-white/15 transition-all duration-500 h-full">
                  <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
                    <c.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold mb-1 text-white">{c.label}</h3>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm hover:text-white transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-white/70 text-sm">{c.value}</p>
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
                  <Input id="nome" name="nome" placeholder="Seu nome" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="email" className="text-foreground/80 text-sm mb-1.5 block">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="whatsapp" className="text-foreground/80 text-sm mb-1.5 block">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="mensagem" className="text-foreground/80 text-sm mb-1.5 block">Como podemos te ajudar?</Label>
                  <Textarea id="mensagem" name="mensagem" placeholder="Descreva sua dúvida ou solicitação..." className="bg-muted/30 border-foreground/10" rows={5} />
                </div>
                <Button type="submit" className="w-full font-heading uppercase tracking-wider border-beam hover-glow">
                  Enviar mensagem
                </Button>
              </form>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* ── Mapa ── */}
      <section className="border-t border-foreground/[0.04] py-10">
        <div className="container">
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-foreground/10">
            <iframe
              title="Localização RT Brasil"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1000!2d-48.35034751806419!3d-21.250251492402167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDE1JzAwLjkiUyA0OMKwMjEnMDEuMyJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CentralAtendimento;
