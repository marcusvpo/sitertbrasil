import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Gift, CheckCircle2 } from "lucide-react";

const STORAGE_SUBSCRIBED = "newsletter_subscribed";
const STORAGE_DISMISSED = "newsletter_dismissed_at";
const DELAY_MS = 8000;
const DISMISS_COOLDOWN_DAYS = 7;

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

    const subscribed = localStorage.getItem(STORAGE_SUBSCRIBED);
    if (subscribed === "true") return;

    const dismissedAt = localStorage.getItem(STORAGE_DISMISSED);
    if (dismissedAt) {
      const elapsedDays = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (elapsedDays < DISMISS_COOLDOWN_DAYS) return;
    }

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
    if (success !== "new" && success !== "already") {
      localStorage.setItem(STORAGE_DISMISSED, String(Date.now()));
    }
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-[#0a0a0a] border border-foreground/10 rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,157,223,0.15)] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          aria-label="Fechar"
          onClick={close}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header gradient */}
        <div className="relative h-32 bg-gradient-to-br from-[#009DDF] via-[#005f8a] to-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
          {success === "new" || success === "already" ? (
            <CheckCircle2 size={56} className="text-white relative z-[1]" strokeWidth={1.5} />
          ) : (
            <div className="relative z-[1] flex items-center gap-3">
              <Mail size={42} className="text-white" strokeWidth={1.5} />
              <Gift size={42} className="text-white" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="p-6 md:p-7">
          {success === "new" ? (
            <div className="text-center space-y-3">
              <h2 className="font-heading text-2xl uppercase tracking-wider text-foreground">
                Obrigado, {form.nome.split(" ")[0]}! 🎉
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Em instantes você receberá o cupom{" "}
                <span className="text-[#009DDF] font-bold">NEWS10</span> no seu email.
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
              <h2 className="font-heading text-xl md:text-2xl uppercase tracking-wider text-foreground mb-2 text-center">
                Entre na newsletter <span className="text-[#009DDF]">MOTOREX</span>
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed text-center mb-5">
                Conteúdo exclusivo de motocross, lubrificação e novidades. Como
                boas-vindas, ganhe{" "}
                <span className="text-[#009DDF] font-bold">10% OFF</span> na sua primeira
                compra com o cupom{" "}
                <span className="text-[#009DDF] font-bold">NEWS10</span>.
              </p>

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
