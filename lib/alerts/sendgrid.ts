import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) sgMail.setApiKey(apiKey);

export async function sendAlert(subject: string, text: string) {
  if (!apiKey) {
    console.warn("SENDGRID_API_KEY not set — skipping alert");
    return;
  }

  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM;
  if (!to || !from) {
    console.warn("ALERT_EMAIL_TO or ALERT_EMAIL_FROM not set — skipping alert");
    return;
  }

  const msg = {
    to,
    from,
    subject,
    text,
  } as any;

  try {
    await sgMail.send(msg);
  } catch (err: any) {
    console.error("Failed to send alert email:", err?.message ?? err);
  }
}

export default sendAlert;
