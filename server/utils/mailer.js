// server/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,  // smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // 465
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ Gmail SMTP Connected Successfully");
  }
});

export default async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email Sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err);
    throw err;
  }
}
