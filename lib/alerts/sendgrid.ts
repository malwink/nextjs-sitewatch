import sgMail from "@sendgrid/mail";

export async function sendAlert(subject: string, text: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM;

  if (!apiKey) {
    console.warn("SENDGRID_API_KEY not set — skipping alert");
    return;
  }
  if (!to || !from) {
    console.warn("ALERT_EMAIL_TO or ALERT_EMAIL_FROM not set — skipping alert");
    return;
  }

  sgMail.setApiKey(apiKey);
  (sgMail as any).setDataResidency?.("eu");

  try {
    await sgMail.send({ to, from, subject, text } as any);
  } catch (err: any) {
    console.error("Failed to send alert email:", err?.message ?? err);
  }
}

export default sendAlert;
