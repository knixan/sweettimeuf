"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdminOrEditor();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/offerter");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Kunde inte uppdatera status");
  }
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
        const { customImageUrl, ...rest } = item;
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
