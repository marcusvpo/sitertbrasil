import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Instagram, MapPin, CheckCircle } from "lucide-react";

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
    <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
      <div className="container">
        <h1 className="font-heading text-3xl md:text-4xl uppercase font-bold text-center mb-12">
          Central de Atendimento
        </h1>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactCards.map((c) => (
            <div key={c.label} className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-6 text-center">
              <c.icon className="mx-auto text-primary mb-3" size={28} />
              <h3 className="font-heading uppercase text-sm font-semibold mb-1">{c.label}</h3>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/70 text-sm hover:text-primary transition-colors">
                  {c.value}
                </a>
              ) : (
                <p className="text-secondary-foreground/70 text-sm">{c.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-center mb-8">
            Fale Conosco
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto text-primary mb-4" size={48} />
              <h3 className="font-heading text-xl uppercase font-bold mb-2">Mensagem enviada!</h3>
              <p className="text-secondary-foreground/70">Retornaremos o mais breve possível.</p>
            </div>
          ) : (
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
              <Button type="submit" className="w-full font-heading uppercase tracking-wider">
                Enviar mensagem
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
export default CentralAtendimento;
