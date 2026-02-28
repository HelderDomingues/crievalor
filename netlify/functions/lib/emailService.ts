
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Email Template IDs (must match template aliases in the Resend Dashboard)
// ---------------------------------------------------------------------------
// payment-confirmed     → Pagamento confirmado / bem-vindo
// payment-expired       → Boleto/Pix expirado sem pagamento
// payment-refunded      → Reembolso / estorno processado
// subscription-canceled → Assinatura cancelada
// trial-ending          → Aviso de fim de trial (triggered separately)
// welcome               → Boas-vindas após cadastro (Auth.tsx flow)
// ---------------------------------------------------------------------------

const VALID_TEMPLATE_IDS = [
    "payment-confirmed",
    "payment-expired",
    "payment-refunded",
    "subscription-canceled",
    "trial-ending",
    "welcome",
] as const;

export type EmailTemplateId = typeof VALID_TEMPLATE_IDS[number];

function getResend(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("[EmailService] RESEND_API_KEY is not configured.");
    }
    return new Resend(apiKey);
}

/**
 * Sends an email using a Resend template by its alias ID.
 *
 * @param to             Recipient email address
 * @param templateId     Alias of the template in the Resend Dashboard
 * @param variables      Key/value pairs matching {{variable}} placeholders in the template
 */
export async function sendTemplateEmail(
    to: string,
    templateId: string,
    variables: Record<string, string>
): Promise<void> {
    const resend = getResend();
    const from = process.env.EMAIL_FROM || "LUMIA <noreply@crievalor.com.br>";

    console.log(`[EmailService] Sending "${templateId}" to ${to}`, variables);

    const { error } = await resend.emails.send({
        from,
        to: [to],
        // Resend supports audienceId + templateId for template-based sending.
        // We rely on the template alias set in the dashboard.
        subject: buildFallbackSubject(templateId),
        html: buildFallbackHtml(templateId, variables),
    });

    if (error) {
        console.error("[EmailService] Resend error:", error);
        throw new Error(`Email send failed: ${JSON.stringify(error)}`);
    }
}

// ---------------------------------------------------------------------------
// Fallback: build subject + HTML inline when no Resend Account Template exists.
// Replace these with your actual Resend template alias once set up.
// ---------------------------------------------------------------------------
function buildFallbackSubject(templateId: string): string {
    const subjects: Record<string, string> = {
        "payment-confirmed": "✅ Pagamento confirmado — Bem-vindo à LUMIA!",
        "payment-expired": "⚠️ Seu pagamento expirou — LUMIA",
        "payment-refunded": "♻️ Reembolso processado — LUMIA",
        "subscription-canceled": "😔 Sua assinatura foi cancelada — LUMIA",
        "trial-ending": "⏳ Seu período gratuito está acabando — LUMIA",
        "welcome": "🎉 Bem-vindo à Crie Valor!",
    };
    return subjects[templateId] ?? "Notificação — LUMIA / Crie Valor";
}

function buildFallbackHtml(templateId: string, vars: Record<string, string>): string {
    const name = vars.name ?? "Consultor";
    const amount = vars.amount ?? "";

    const wrap = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Crie Valor</title>
<style>
  body { margin:0; padding:0; background:#010816; font-family: 'Inter', Arial, sans-serif; color: #e2e8f0; }
  .container { max-width:600px; margin:40px auto; background:#051329; border-radius:12px; overflow:hidden; }
  .header { background:linear-gradient(135deg, #1a3a6b 0%, #0a1e3d 100%); padding:40px 32px; text-align:center; }
  .header img { width:120px; }
  .header h1 { font-size:22px; color:#fff; margin:16px 0 0; }
  .body { padding:32px; }
  .body p { line-height:1.7; color:#94a3b8; }
  .highlight { color:#6366f1; font-weight:700; }
  .badge { display:inline-block; background:#6366f1; color:#fff; padding:4px 14px; border-radius:999px; font-size:13px; margin-bottom:16px; }
  .btn { display:inline-block; margin-top:24px; padding:14px 28px; background:#6366f1;
         color:#fff; text-decoration:none; border-radius:8px; font-weight:600; }
  .footer { padding:24px 32px; text-align:center; font-size:12px; color:#475569; border-top:1px solid #1a2e4c; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Crie Valor · LUMIA</h1>
  </div>
  <div class="body">
    ${buildEmailBody(templateId, name, amount, vars)}
    <a href="https://crievalor.com.br/dashboard" class="btn">Acessar minha conta</a>
  </div>
  <div class="footer">
    Crie Valor — Inteligência Organizacional<br>
    Você está recebendo este e-mail porque possui uma conta em crievalor.com.br<br>
    <a href="https://crievalor.com.br" style="color:#6366f1;">crievalor.com.br</a>
  </div>
</div>
</body>
</html>`;
    return wrap("");
}

function buildEmailBody(templateId: string, name: string, amount: string, vars: Record<string, string>): string {
    switch (templateId) {
        case "payment-confirmed":
            return `
                <span class="badge">✅ Pagamento Confirmado</span>
                <h2 style="color:#fff">Olá, ${name}!</h2>
                <p>Seu pagamento de <span class="highlight">${amount}</span> foi confirmado com sucesso.</p>
                <p>Método: <strong style="color:#e2e8f0">${vars.payment_method ?? ""}</strong></p>
                <p>Você já pode acessar todos os recursos da LUMIA — sua plataforma de inteligência organizacional.</p>`;

        case "payment-expired":
            return `
                <span class="badge" style="background:#f59e0b">⚠️ Pagamento Expirado</span>
                <h2 style="color:#fff">Olá, ${name}!</h2>
                <p>Seu boleto ou QR Code PIX <strong style="color:#f59e0b">expirou</strong> sem que o pagamento fosse confirmado.</p>
                <p>Para garantir acesso à LUMIA, acesse sua conta e gere um novo link de pagamento.</p>`;

        case "payment-refunded":
            return `
                <span class="badge" style="background:#22c55e">♻️ Reembolso Processado</span>
                <h2 style="color:#fff">Olá, ${name}!</h2>
                <p>Processamos o reembolso de <span class="highlight">${amount}</span> para você.</p>
                <p>O valor retorna ao seu banco em até 5 dias úteis, dependendo da instituição financeira.</p>
                <p>Se tiver dúvidas, entre em contato com nossa equipe.</p>`;

        case "subscription-canceled":
            return `
                <span class="badge" style="background:#ef4444">❌ Assinatura Cancelada</span>
                <h2 style="color:#fff">Olá, ${name}!</h2>
                <p>Sua assinatura da LUMIA foi <strong style="color:#ef4444">cancelada</strong>.</p>
                <p>Seu acesso permanece disponível até o fim do período já pago. Após isso, os recursos premium serão desativados.</p>
                <p>Sentiremos sua falta! Se mudar de ideia, você pode reativar a qualquer momento.</p>`;

        case "trial-ending":
            return `
                <span class="badge" style="background:#f59e0b">⏳ Trial Encerrando</span>
                <h2 style="color:#fff">Olá, ${name}!</h2>
                <p>Seu período gratuito de avaliação da LUMIA está chegando ao fim.</p>
                <p>Para continuar tendo acesso a todos os recursos, faça o upgrade do seu plano antes que o trial expire.</p>`;

        case "welcome":
            return `
                <span class="badge">🎉 Bem-vindo!</span>
                <h2 style="color:#fff">Olá, ${name}!</h2>
                <p>Sua conta na <strong style="color:#6366f1">Crie Valor</strong> foi criada com sucesso!</p>
                <p>Explore a plataforma LUMIA e descubra como a inteligência organizacional pode transformar sua empresa.</p>`;

        default:
            return `<p>Olá, ${name}! Você tem uma nova notificação da Crie Valor.</p>`;
    }
}
