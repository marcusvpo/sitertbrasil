import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

const Parceiros = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
      <div className="container">
        <h1 className="font-heading text-3xl md:text-4xl uppercase font-bold text-center mb-4">
          Parceiros RT Brasil
        </h1>
        <p className="text-secondary-foreground/60 text-center mb-16">
          Em breve — Pilotos e revendedores parceiros.
        </p>

        {/* Partner registration form */}
        <div className="max-w-xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-center mb-8">
            Quero ser Parceiro
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto text-primary mb-4" size={48} />
              <h3 className="font-heading text-xl uppercase font-bold mb-2">Solicitação enviada!</h3>
              <p className="text-secondary-foreground/70">Analisaremos seu perfil e entraremos em contato.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" placeholder="Seu nome completo" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Input id="empresa" name="empresa" placeholder="Nome da empresa" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email-confirm">Confirmação de E-mail</Label>
                <Input id="email-confirm" name="email-confirm" type="email" placeholder="Confirme seu e-mail" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required className="mt-1" />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="consentimento" required />
                <Label htmlFor="consentimento" className="text-sm text-secondary-foreground/70 leading-tight">
                  Concordo em receber contato da RT Brasil sobre parcerias e produtos MOTOREX.
                </Label>
              </div>
              <Button type="submit" className="w-full font-heading uppercase tracking-wider">
                Enviar solicitação
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
export default Parceiros;
