"use server";

import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactMessageEmail } from "@/lib/emails";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().min(1).max(5000),
});

const CONTACT_RECIPIENT = "lg.sweets10@gmail.com";

export async function sendContactMessage(values: unknown) {
  const parsed = ContactSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Ogiltiga uppgifter");
  }
  const { name, email, phone, message } = parsed.data;

  await checkRateLimit("contact", { windowMs: 15 * 60 * 1000, max: 5 });

  try {
    await sendEmail({
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: `Nytt meddelande från ${name} – Kontaktformulär`,
      html: contactMessageEmail({ name, email, phone, message }),
    });
  } catch (error) {
    console.error("Kunde inte skicka kontaktmeddelande:", error);
    throw new Error("Kunde inte skicka meddelandet, försök igen senare");
  }

  return { success: true };
}
