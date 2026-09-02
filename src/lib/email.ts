import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465, // implicit TLS på 465, annars STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  await transporter.sendMail({
    from: `"SweetTime UF" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });
}
