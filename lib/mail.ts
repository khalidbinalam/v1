import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
export const resend = new Resend(resendApiKey);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resendApiKey) {
    console.log('[Mock Email] To:', to, '| Subject:', subject, '| Html:', html);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Underground Game Hub <noreply@undergroundgamehub.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
