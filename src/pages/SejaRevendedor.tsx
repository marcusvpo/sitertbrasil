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
      {/* Banner — clean, no overlay */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-revendedor.jpg" alt="Seja um Revendedor MOTOREX" className="w-full h-auto block" />
      </section>

      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container max-w-xl">
          <AnimateOnScroll className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold">
              Cadastro de Revendedor
            </h2>
          </AnimateOnScroll>

          {submitted ? (
            <AnimateOnScroll animation="scale-in">
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-primary mb-4" size={48} />
                <h3 className="font-heading text-xl uppercase font-bold mb-2">Cadastro enviado!</h3>
                <p className="text-secondary-foreground/70">Entraremos em contato em breve.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <AnimateOnScroll animation="fade-up">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" name="nome" placeholder="Seu nome completo" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="empresa">Nome da Empresa</Label>
                  <Input id="empresa" name="empresa" placeholder="Nome da sua empresa" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required className="mt-1" />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="consentimento" required />
                  <Label htmlFor="consentimento" className="text-sm text-secondary-foreground/70 leading-tight">
                    Concordo em receber contato da RT Brasil sobre produtos e condições comerciais MOTOREX.
                  </Label>
                </div>
                <Button type="submit" className="w-full font-heading uppercase tracking-wider hover-glow">
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
