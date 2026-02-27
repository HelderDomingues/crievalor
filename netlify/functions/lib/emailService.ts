import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using a predefined template in the Resend dashboard.
 * 
 * @param to recipient email address
 * @param templateId the alias or ID of the template in Resend Dashboard
 * @param variables object containing values for variables defined in the template as {{key}}
 */
export async function sendTemplateEmail(
    to: string,
    templateId: string,
    variables: Record<string, string>
) {
    const from = process.env.EMAIL_FROM || 'LUMIA <noreply@crievalor.com.br>';

    console.log(`[EmailService] Sending template email "${templateId}" to ${to}`);

    try {
        const { data, error } = await resend.emails.send({
            from,
            to: [to],
            template: {
                id: templateId,
                variables,
            },
        });

        if (error) {
            console.error('[EmailService] Resend API Error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return data;
    } catch (err: any) {
        console.error('[EmailService] Unexpected Error:', err);
        throw err;
    }
}
