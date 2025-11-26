// server/utils/mailer.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html, text }) {
  try {
    const data = await resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("📨 Email Sent via Resend:", data);
    return data;
  } catch (error) {
    console.error("❌ RESEND EMAIL ERROR:", error);
    throw error;
  }
}
