import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// ---------------------------------------------------------------------------
// Nodemailer Transport Singleton
// ---------------------------------------------------------------------------

const SMTP_HOST = process.env.SMTP_HOST || "localhost";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "noreply@menontrucks.com";
const SMTP_SECURE = process.env.SMTP_SECURE === "true";

export const transporter: Transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth:
    SMTP_USER && SMTP_PASS
      ? {
          user: SMTP_USER,
          pass: SMTP_PASS,
        }
      : undefined,
});

/**
 * Send an email using the configured transport.
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  await transporter.sendMail({
    from: SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

/**
 * Verify SMTP connection is working.
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("[Email] SMTP connection verified");
    return true;
  } catch (err) {
    console.error("[Email] SMTP connection failed:", err);
    return false;
  }
}

export default transporter;
