import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

type SendEmailInput = { to: string; subject: string; html: string };

export async function sendEmailBrevo({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('Faltan EMAIL_API_KEY o EMAIL_FROM');

  const match = from.match(/^(.*)<(.+)>$/);
  const sender = match
    ? { name: match[1].trim(), email: match[2].trim() }
    : { name: from, email: from };

  await axios.post(
    BREVO_API,
    { sender, to: [{ email: to }], subject, htmlContent: html },
    { headers: { 'api-key': apiKey, 'Content-Type': 'application/json' }, timeout: 15000 }
  );
}

export async function sendOtpEmail(to: string, code: string) {
  const subject = 'Tu código OTP';
  const html = `
    <div style="font-family:system-ui,Arial,sans-serif">
      <h2>Tu código de verificación</h2>
      <p>Usa este código para continuar:</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</div>
      <p style="color:#666">Caduca en 5 minutos. Si no fuiste tú, ignora este correo.</p>
    </div>`;
  await sendEmailBrevo({ to, subject, html });
}