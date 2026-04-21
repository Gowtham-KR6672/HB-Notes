import nodemailer from "nodemailer";
import { env } from "@/lib/env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!env.EMAIL_USER || !env.EMAIL_PASS || !env.EMAIL_FROM) {
    throw new Error("Email service is not configured. Please set EMAIL_USER, EMAIL_PASS, and EMAIL_FROM.");
  }

  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  });

  return transporter;
}

export async function sendSignupOtpEmail({
  email,
  name,
  otp
}: {
  email: string;
  name: string;
  otp: string;
}) {
  const transport = getTransporter();

  await transport.sendMail({
    from: `HB Notes <${env.EMAIL_FROM}>`,
    to: email,
    subject: "Your HB Notes verification code",
    text: `Hello ${name},\n\nYour HB Notes OTP is ${otp}. It will expire in 10 minutes.\n\nIf you did not request this, you can ignore this email.\n`,
    html: `
      <div style="margin:0;padding:32px;background:#f6f3ea;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:40px;border:1px solid #e7e0d4;">
          <div style="display:inline-block;background:#0f172a;color:#f8fafc;border-radius:16px;padding:10px 14px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;">
            HB Notes
          </div>
          <h1 style="margin:24px 0 12px;font-size:30px;line-height:1.2;">Verify your email address</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#475569;">
            Hello ${escapeHtml(name)}, your verification code for HB Notes is below.
          </p>
          <div style="margin:28px 0;padding:22px 24px;border-radius:20px;background:#eff6ff;border:1px solid #bfdbfe;text-align:center;">
            <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#0369a1;">One-time password</div>
            <div style="margin-top:12px;font-size:34px;letter-spacing:0.35em;font-weight:700;color:#0f172a;">${otp}</div>
          </div>
          <p style="margin:0;font-size:14px;line-height:1.8;color:#64748b;">
            This OTP expires in 10 minutes. If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    `
  });
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
