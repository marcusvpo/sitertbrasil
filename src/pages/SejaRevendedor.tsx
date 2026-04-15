import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const SejaRevendedor = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Banner */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative py-12 md:py-20 mesh-gradient">
        <div className="container relative z-10 max-w-xl">
          <AnimateOnScroll className="text-center mb-8">
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.9]">
              Cadastro de <span className="text-gradient">Revendedor</span>
            </h1>
          </AnimateOnScroll>

          {submitted ? (
            <AnimateOnScroll animation="scale-in">
              <div className="text-center py-16">
                <CheckCircle className="mx-auto text-primary mb-4" size={48} />
                <h3 className="font-heading text-xl font-bold mb-2">Cadastro enviado!</h3>
                <p className="text-muted-foreground">Entraremos em contato em breve.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <AnimateOnScroll animation="fade-up">
              <form onSubmit={handleSubmit} className="gradient-border rounded-xl p-7 md:p-10 space-y-5 bg-foreground/[0.02]">
                <div className="neon-focus rounded-md">
                  <Label htmlFor="nome" className="text-foreground/80 text-sm mb-1.5 block">Nome Completo</Label>
                  <Input id="nome" name="nome" placeholder="Seu nome completo" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="empresa" className="text-foreground/80 text-sm mb-1.5 block">Nome da Empresa</Label>
                  <Input id="empresa" name="empresa" placeholder="Nome da sua empresa" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="email" className="text-foreground/80 text-sm mb-1.5 block">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="whatsapp" className="text-foreground/80 text-sm mb-1.5 block">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Checkbox id="consentimento" />
                  <Label htmlFor="consentimento" className="text-sm text-muted-foreground leading-tight">
                    Concordo em receber contato da RT Brasil sobre produtos e condições comerciais <span className="text-motorex font-semibold">MOTOREX</span>.
                  </Label>
                </div>
                <Button type="submit" className="w-full font-heading uppercase tracking-wider border-beam hover-glow">
                  Enviar cadastro
                </Button>
              </form>
            </AnimateOnScroll>
          )}
        </div>
      </section>
    </>
  );
};

export default SejaRevendedor;
