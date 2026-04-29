// Edge Function: send-newsletter-welcome
// Triggered by Supabase Database Webhook on INSERT into newsletter_submissions.
// Sends a welcome email with the NEWS10 coupon and Substack link via Resend.
// Then marks cupom_enviado = true on the row.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUBSTACK_URL = "https://substack.com/@rtbrasilmotorex";
const COUPON = "NEWS10";
const FROM_EMAIL = Deno.env.get("NEWSLETTER_FROM_EMAIL") ?? "noreply@rtbrasil.com";
const FROM_NAME = "RT Brasil — MOTOREX";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cupom_enviado: boolean;
    created_at: string;
  };
  schema: string;
  old_record: null | Record<string, unknown>;
}

const buildEmailHtml = (nome: string) => {
  const firstName = nome.split(" ")[0];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Bem-vindo à Newsletter MOTOREX</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#009DDF 0%,#005f8a 100%);padding:36px 30px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                Bem-vindo, ${firstName}!
              </h1>
              <p style="margin:8px 0 0;color:#e0f4ff;font-size:14px;">
                Você acaba de entrar na comunidade MOTOREX 🤘
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 30px 16px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333333;">
                Obrigado por se inscrever na nossa newsletter! Como prometido, aqui está seu cupom de boas-vindas:
              </p>
            </td>
          </tr>

          <!-- Coupon -->
          <tr>
            <td align="center" style="padding:0 30px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;border:2px dashed #009DDF;border-radius:8px;padding:24px 36px;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 6px;color:#009DDF;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">
                      Seu cupom
                    </p>
                    <p style="margin:0;color:#ffffff;font-size:36px;letter-spacing:6px;font-weight:900;">
                      ${COUPON}
                    </p>
                    <p style="margin:8px 0 0;color:#ffffff;font-size:14px;">
                      <strong style="color:#009DDF;">10% OFF</strong> na primeira compra
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTAs -->
          <tr>
            <td style="padding:8px 30px 16px;">
              <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#555555;text-align:center;">
                Use no checkout do nosso site. Cupom de uso único por cliente.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:0 6px;">
                    <a href="https://rtbrasil.com.br/motorex" style="display:inline-block;background:#009DDF;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;">
                      Ver Produtos
                    </a>
                  </td>
                  <td align="center" style="padding:0 6px;">
                    <a href="${SUBSTACK_URL}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;">
                      Nossa Substack
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Substack pitch -->
          <tr>
            <td style="padding:24px 30px 8px;">
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:0 0 20px;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#333333;">
                <strong>📬 Não perca nenhum conteúdo</strong>
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#555555;">
                Acompanhe nossa Substack para receber artigos exclusivos sobre motocross, lubrificação,
                manutenção e novidades do mundo MOTOREX direto no seu email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 30px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999999;">
                Você está recebendo este email porque se inscreveu em rtbrasil.com.br
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#999999;">
                © ${new Date().getFullYear()} RT Brasil — Distribuidora oficial MOTOREX no Brasil
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("[send-newsletter-welcome] RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = (await req.json()) as WebhookPayload;
    console.log("[send-newsletter-welcome] payload type:", payload.type);

    if (payload.type !== "INSERT" || payload.table !== "newsletter_submissions") {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { id, nome, email, cupom_enviado } = payload.record;

    if (cupom_enviado) {
      console.log("[send-newsletter-welcome] already sent, skipping", id);
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || !nome) {
      return new Response(JSON.stringify({ error: "missing email or nome" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject: `🎁 Seu cupom NEWS10 chegou, ${nome.split(" ")[0]}!`,
        html: buildEmailHtml(nome),
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[send-newsletter-welcome] resend error", resendData);
      return new Response(
        JSON.stringify({ error: "resend failed", detail: resendData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[send-newsletter-welcome] sent", { id, email, resendId: resendData.id });

    // Mark as sent (using service role)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { error: updateErr } = await supabase
      .from("newsletter_submissions")
      .update({
        cupom_enviado: true,
        email_enviado_at: new Date().toISOString(),
        status: "enviado",
      })
      .eq("id", id);

    if (updateErr) {
      console.error("[send-newsletter-welcome] update error", updateErr);
    }

    return new Response(JSON.stringify({ success: true, resendId: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-newsletter-welcome] unexpected error", err);
    return new Response(
      JSON.stringify({ error: String((err as Error).message ?? err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
