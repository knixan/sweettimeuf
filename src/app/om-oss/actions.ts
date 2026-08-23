"use server";

import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(values: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const parsed = ContactSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Ogiltiga uppgifter");
  }
  const { name, email, phone, message } = parsed.data;

  await checkRateLimit("contact", { windowMs: 15 * 60 * 1000, max: 5 });

  try {
    await sendEmail({
      to: "lg.sweets10@gmail.com",
      replyTo: email,
      subject: `Nytt meddelande från ${name} – Kontaktformulär`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2>Nytt meddelande via kontaktformuläret</h2>
          <p><strong>Namn:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
          <p style="margin-top:16px"><strong>Meddelande:</strong></p>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Kunde inte skicka kontaktmeddelande:", error);
    throw new Error("Kunde inte skicka meddelandet, försök igen senare");
  }

  return { success: true };
}
