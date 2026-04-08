import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const IndiqueCidade = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Banner */}
      <section className="relative w-full overflow-hidden">
        <img src="/images/banner-indique.jpg" alt="Indique sua Cidade" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative py-12 md:py-20 mesh-gradient">
        <div className="container relative z-10 max-w-xl">
          <AnimateOnScroll className="text-center mb-8">
            <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.9]">
              Indique sua <span className="text-gradient">Cidade</span>
            </h1>
          </AnimateOnScroll>

          {submitted ? (
            <AnimateOnScroll animation="scale-in">
              <div className="text-center py-16">
                <CheckCircle className="mx-auto text-primary mb-4" size={48} />
                <h3 className="font-heading text-xl font-bold mb-2">Indicação enviada!</h3>
                <p className="text-muted-foreground">Obrigado por nos ajudar a expandir a rede MOTOREX.</p>
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
                  <Label htmlFor="whatsapp" className="text-foreground/80 text-sm mb-1.5 block">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="cidade" className="text-foreground/80 text-sm mb-1.5 block">Nome da Cidade</Label>
                  <Input id="cidade" name="cidade" placeholder="Ex: Campinas - SP" required className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="lojista" className="text-foreground/80 text-sm mb-1.5 block">Nome do Lojista</Label>
                  <Input id="lojista" name="lojista" placeholder="Nome da loja ou pessoa" className="bg-muted/30 border-foreground/10" />
                </div>
                <div className="neon-focus rounded-md">
                  <Label htmlFor="contato-lojista" className="text-foreground/80 text-sm mb-1.5 block">Contato do Lojista</Label>
                  <Input id="contato-lojista" name="contato-lojista" type="tel" placeholder="Telefone ou WhatsApp" className="bg-muted/30 border-foreground/10" />
                </div>
                <Button type="submit" className="w-full font-heading uppercase tracking-wider border-beam hover-glow">
                  Enviar indicação
                </Button>
              </form>
            </AnimateOnScroll>
          )}
        </div>
      </section>
    </>
  );
};

export default IndiqueCidade;
