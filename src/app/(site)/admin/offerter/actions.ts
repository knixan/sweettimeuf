"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor, requireAdmin } from "@/lib/server-auth";
import { uploadUrlSchema } from "@/lib/uploads";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateOrderFlags(
  orderId: string,
  flags: { handled?: boolean; shipped?: boolean; invoiceSent?: boolean },
) {
  await requireAdminOrEditor();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(flags.handled !== undefined && { handled: flags.handled }),
        ...(flags.shipped !== undefined && { shipped: flags.shipped }),
        ...(flags.invoiceSent !== undefined && {
          invoiceSent: flags.invoiceSent,
        }),
      },
    });

    revalidatePath("/admin/offerter");
    return { success: true };
  } catch (error) {
    console.error("Error updating order flags:", error);
    throw new Error("Kunde inte uppdatera order");
  }
}

export async function deleteOrder(orderId: string) {
  await requireAdminOrEditor();
  try {
    await prisma.order.delete({ where: { id: orderId } });
    revalidatePath("/admin/offerter");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

const OrderItemSchema = z.object({
  productId: z.string().min(1).max(100),
  title: z.string().min(1).max(300),
  quantity: z.number().int().positive().max(10000),
  price: z.number().min(0).max(1_000_000),
  image: z.string().max(2000).optional(),
  // Ogiltiga/otillåtna URL:er droppas i stället för att blockera hela sparningen.
  customImageUrl: uploadUrlSchema.optional().catch(undefined),
  selectedVariant: z.string().max(200).optional(),
});

const UpdateOrderSchema = z.object({
  customerName: z.string().min(1),
  customerLastName: z.string().optional(),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  customerCompany: z.string().optional(),
  orgNumber: z.string().optional(),
  customerAddress: z.string().min(1),
  customerPostalCode: z.string().min(1),
  customerCity: z.string().min(1),
  invoiceAddress: z.string().optional(),
  invoicePostalCode: z.string().optional(),
  invoiceCity: z.string().optional(),
  items: z.array(OrderItemSchema).min(1),
  notes: z.string().optional(),
});

export async function getOrderForEdit(orderId: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error("Order hittades inte");
  }
  return order;
}

export async function updateOrder(orderId: string, values: unknown) {
  await requireAdmin();

  const parsed = UpdateOrderSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Ogiltiga värden i ordern");
  }
  const data = parsed.data;

  const totalPrice = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await prisma.order.update({
    where: { id: orderId },
    data: {
      customerName: data.customerName,
      customerLastName: data.customerLastName || null,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      customerCompany: data.customerCompany || null,
      orgNumber: data.orgNumber || null,
      customerAddress: data.customerAddress,
      customerPostalCode: data.customerPostalCode,
      customerCity: data.customerCity,
      invoiceAddress: data.invoiceAddress || null,
      invoicePostalCode: data.invoicePostalCode || null,
      invoiceCity: data.invoiceCity || null,
      items: data.items,
      totalPrice,
      notes: data.notes || null,
    },
  });

  revalidatePath("/admin/offerter");
  return { success: true };
}

export async function removeCustomerImage(orderId: string, productId: string) {
  await requireAdminOrEditor();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order hittades inte");
    }

    // Parse items and remove customImageUrl from the specific product
    const items = order.items as Array<{
      productId: string;
      title: string;
      quantity: number;
      price: number;
      image?: string;
      customImageUrl?: string;
    }>;

    const updatedItems = items.map((item) => {
      if (item.productId === productId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { customImageUrl: _, ...rest } = item;
        return rest;
      }
      return item;
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { items: updatedItems },
    });

    revalidatePath("/admin/offerter");
    return { success: true };
  } catch (error) {
    console.error("Error removing customer image:", error);
    throw new Error("Kunde inte ta bort bilden");
  }
}
