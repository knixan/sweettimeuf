"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
  totalPrice: number;
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
    totalPrice,
  } = values;

  if (!firstName || !lastName || !email || !address || !postalCode || !city || !items) {
    throw new Error("Alla obligatoriska fält måste fyllas i");
  }

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
        items,
        totalPrice,
        notes: notes || null,
        status: "pending",
        handled: false,
        shipped: false,
        invoiceSent: false,
      },
    });

    revalidatePath("/admin/offerter");

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error instanceof Error ? error : new Error("Kunde inte skapa beställning");
  }
}
