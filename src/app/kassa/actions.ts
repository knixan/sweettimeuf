"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const CartItemSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().positive().max(10000),
  price: z.number().positive().max(1_000_000),
  image: z.string().optional(),
  customImageUrl: z.string().optional(),
  selectedVariant: z.string().optional(),
});

const CartItemsSchema = z.array(CartItemSchema).min(1).max(100);

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(values: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  orgNumber?: string;
  address: string;
  postalCode: string;
  city: string;
  invoiceAddress?: string;
  invoicePostalCode?: string;
  invoiceCity?: string;
  notes?: string;
  items: unknown;
}) {
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    orgNumber,
    address,
    postalCode,
    city,
    invoiceAddress,
    invoicePostalCode,
    invoiceCity,
    notes,
    items,
  } = values;

  if (!firstName || !lastName || !email || !address || !postalCode || !city) {
    throw new Error("Alla obligatoriska fält måste fyllas i");
  }

  const parsedItems = CartItemsSchema.safeParse(items);
  if (!parsedItems.success) {
    throw new Error("Ogiltiga varor i beställningen");
  }
  const validatedItems = parsedItems.data;
  const totalPrice = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Check if there's a logged-in user
  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      userId = session.user.id;
    }
  } catch {
    // Not logged in — that's fine
  }

  try {
    const orderNumber = generateOrderNumber();
    const customerName = `${firstName} ${lastName}`.trim();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId ?? null,
        customerName,
        customerLastName: lastName,
        customerEmail: email,
        customerPhone: phone || null,
        customerCompany: company || null,
        orgNumber: orgNumber || null,
        customerAddress: address,
        customerPostalCode: postalCode,
        customerCity: city,
        invoiceAddress: invoiceAddress || null,
        invoicePostalCode: invoicePostalCode || null,
        invoiceCity: invoiceCity || null,
        items: validatedItems,
        totalPrice,
        notes: notes || null,
        status: "pending",
        handled: false,
        shipped: false,
        invoiceSent: false,
      },
    });

    revalidatePath("/admin/offerter");

    const itemRows = validatedItems
      .map(
        (item) =>
          `<tr>
            <td style="padding:6px 12px;border-bottom:1px solid #eee">${item.title}${item.selectedVariant ? ` – ${item.selectedVariant}` : ""}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${(item.price * item.quantity).toFixed(2)} kr</td>
          </tr>`,
      )
      .join("");

    try {
      await sendEmail({
        to: email,
        subject: `Orderbekräftelse ${order.orderNumber} – SweetTime UF`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2>Tack för din beställning!</h2>
            <p>Hej ${firstName},</p>
            <p>Vi har tagit emot din beställning och återkommer så snart vi har hanterat den.</p>
            <h3>Ordernummer: ${order.orderNumber}</h3>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <thead>
                <tr style="background:#f5f5f5">
                  <th style="padding:8px 12px;text-align:left">Produkt</th>
                  <th style="padding:8px 12px;text-align:center">Antal</th>
                  <th style="padding:8px 12px;text-align:right">Pris</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:8px 12px;font-weight:bold">Totalt</td>
                  <td style="padding:8px 12px;text-align:right;font-weight:bold">${totalPrice.toFixed(2)} kr</td>
                </tr>
              </tfoot>
            </table>
            <p style="color:#666;font-size:14px">Leveransadress: ${address}, ${postalCode} ${city}</p>
            <p style="margin-top:24px">Med vänliga hälsningar,<br/>SweetTime UF</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Kunde inte skicka orderbekräftelse:", emailError);
    }

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error instanceof Error
      ? error
      : new Error("Kunde inte skapa beställning");
  }
}
