import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Gift, CheckCircle2 } from "lucide-react";

const STORAGE_SUBSCRIBED = "newsletter_subscribed";
const DELAY_MS = 8000;

const schema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255),
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20, "Telefone inválido")
    .regex(/^[\d\s()+-]+$/, "Apenas dígitos, espaços e ()+-"),
});

type FormData = z.infer<typeof schema>;

const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ nome: "", email: "", telefone: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | "new" | "already">(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Partial<Record<keyof FormData, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormData;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    setSubmitting(true);
    try {
      const emailLower = parsed.data.email.toLowerCase();

      // Check if already subscribed
      const { data: existing } = await supabase
        .from("newsletter_submissions")
        .select("id")
        .eq("email", emailLower)
        .maybeSingle();

      if (existing) {
        localStorage.setItem(STORAGE_SUBSCRIBED, "true");
        setSuccess("already");
        return;
      }

      const { error } = await supabase.from("newsletter_submissions").insert({
        nome: parsed.data.nome,
        email: emailLower,
        telefone: parsed.data.telefone,
      });

      if (error) {
        // Race condition: unique violation = already subscribed
        if (error.code === "23505") {
          localStorage.setItem(STORAGE_SUBSCRIBED, "true");
          setSuccess("already");
          return;
        }
        throw error;
      }

      localStorage.setItem(STORAGE_SUBSCRIBED, "true");
      setSuccess("new");
    } catch (err) {
      console.error("[NewsletterPopup] submit error", err);
      setErrors({ email: "Erro ao enviar. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md my-auto bg-[#0a0a0a] border border-foreground/10 rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(38,173,151,0.15)] animate-in zoom-in-95 duration-300 max-h-[calc(100vh-1.5rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Fechar"
          onClick={close}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="relative h-24 sm:h-28 shrink-0 bg-gradient-to-br from-[#26ad97] via-[#0f6b5f] to-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
          {success === "new" || success === "already" ? (
            <CheckCircle2 size={48} className="text-white relative z-[1]" strokeWidth={1.5} />
          ) : (
            <div className="relative z-[1] flex items-center gap-3">
              <Mail size={36} className="text-white" strokeWidth={1.5} />
              <Gift size={36} className="text-white" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {success === "new" ? (
            <div className="text-center space-y-3">
              <h2 className="font-heading text-2xl uppercase tracking-wider text-foreground">
                Obrigado, {form.nome.split(" ")[0]}! 🎉
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Em instantes você receberá o cupom{" "}
                <span className="text-[#26ad97] font-bold">NEWS10</span> no seu email.
                Confira também a caixa de spam.
              </p>
              <Button onClick={close} className="w-full mt-4">
                FECHAR
              </Button>
            </div>
          ) : success === "already" ? (
            <div className="text-center space-y-3">
              <h2 className="font-heading text-2xl uppercase tracking-wider text-foreground">
                Você já está inscrito!
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Esse email já está na nossa lista. Obrigado por fazer parte da comunidade
                MOTOREX! 🤘
              </p>
              <Button onClick={close} className="w-full mt-4">
                FECHAR
              </Button>
            </div>
          ) : (
            <>
              <h2 className="font-heading text-lg md:text-xl uppercase tracking-wider text-foreground mb-1 text-center leading-tight">
                Inscreva-se e garanta <span className="text-[#26ad97]">10% OFF</span> exclusivo
              </h2>
              <p className="text-[10px] text-foreground/50 text-center mb-4 italic">
                válido apenas na primeira compra
              </p>
              <div className="text-[13px] text-foreground/75 leading-relaxed mb-5 space-y-2.5 border-l-2 border-[#26ad97]/60 pl-3">
                <p>
                  Sabe quando o parceirão de treino te pergunta:{" "}
                  <span className="text-foreground font-semibold">“como você melhorou tanto?”</span>
                </p>
                <p>
                  Você responde: <span className="text-foreground">“Me inscrevi no jornalzinho semanal da <span className="text-[#26ad97] font-bold">RT Brasil MOTOREX</span>. Toda <span className="font-semibold">quarta às 10h</span> recebo conteúdo <span className="font-semibold">exclusivo</span> de campeonatos, produtos oficiais <span className="text-[#26ad97] font-bold">MOTOREX</span> e dicas de <span className="font-semibold">performance</span> direto dos pilotos parceiros: <span className="text-[#26ad97] font-bold">Lorenzo Ricken</span>, <span className="text-[#26ad97] font-bold">Otávio 05</span>, <span className="text-[#26ad97] font-bold">Rodrigo Galiotto</span> e <span className="text-[#26ad97] font-bold">Marcelo Galiotto</span>.”</span>
                </p>
                <p className="text-foreground/90">
                  Fácil, né? E ainda garantimos seu <span className="text-[#26ad97] font-bold">10% OFF</span> de boas-vindas. 🤘
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    placeholder="Nome completo"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="bg-white/5 border-foreground/10 h-11"
                    disabled={submitting}
                  />
                  {errors.nome && (
                    <p className="text-destructive text-xs mt-1">{errors.nome}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Seu melhor email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-white/5 border-foreground/10 h-11"
                    disabled={submitting}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Telefone com DDD"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="bg-white/5 border-foreground/10 h-11"
                    disabled={submitting}
                  />
                  {errors.telefone && (
                    <p className="text-destructive text-xs mt-1">{errors.telefone}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                  disabled={submitting}
                >
                  {submitting ? "ENVIANDO..." : "QUERO MEU CUPOM"}
                </Button>

                <p className="text-[10px] text-foreground/40 text-center mt-3">
                  Ao se inscrever você concorda em receber nossos emails. Cupom de uso
                  único por cliente.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
