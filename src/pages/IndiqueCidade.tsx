import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const IndiqueCidade = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-indique.jpg" alt="Indique sua Cidade" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-secondary-foreground max-w-lg">
          <p className="text-secondary-foreground/90 text-sm md:text-base">Indique uma loja na sua região ou seja o primeiro a revender.</p>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground py-16 md:py-24">
        <div className="container max-w-xl">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-center mb-8">
            Formulário de Indicação
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto text-primary mb-4" size={48} />
              <h3 className="font-heading text-xl uppercase font-bold mb-2">Indicação enviada!</h3>
              <p className="text-secondary-foreground/70">Obrigado por nos ajudar a expandir a rede MOTOREX.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" placeholder="Seu nome" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cidade">Nome da Cidade</Label>
                <Input id="cidade" name="cidade" placeholder="Ex: Campinas - SP" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lojista">Nome do Lojista</Label>
                <Input id="lojista" name="lojista" placeholder="Nome da loja ou pessoa" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contato-lojista">Contato do Lojista</Label>
                <Input id="contato-lojista" name="contato-lojista" type="tel" placeholder="Telefone ou WhatsApp do lojista" className="mt-1" />
              </div>
              <Button type="submit" className="w-full font-heading uppercase tracking-wider">
                Enviar indicação
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};
export default IndiqueCidade;
