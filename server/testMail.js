import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Farm2Gov" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "SMTP TEST ✔",
      text: "If you received this, Gmail SMTP is working!",
    });
    console.log("SUCCESS:", info.messageId);
  } catch (err) {
    console.error("MAIL ERROR:", err);
  }
}

test();
