"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(values: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: string;
  postalCode: string;
  city: string;
  notes?: string;
  items: unknown;
  totalPrice: number;
}) {
  const { name, email, phone, company, address, postalCode, city, notes, items, totalPrice } = values;

  if (!name || !email || !address || !postalCode || !city || !items) {
    throw new Error("Namn, e-post, adress och minst en produkt krävs");
  }

  try {
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: name,
        customerEmail: email,
        customerPhone: phone || null,
        customerCompany: company || null,
        customerAddress: address,
        customerPostalCode: postalCode,
        customerCity: city,
        items,
        totalPrice,
        notes: notes || null,
        status: "pending",
      },
    });

    revalidatePath("/admin/offerter");

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin

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
