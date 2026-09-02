"use server";

import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { orderConfirmationEmail } from "@/lib/emails";
import { getDisplayPrice, type BuyerType } from "@/lib/pricing";
import { uploadUrlSchema } from "@/lib/uploads";
import { z } from "zod";

// `title`, `price` och `image` från klienten valideras för form men används
// aldrig – de slås upp mot databasen nedan. `customImageUrl` kommer alltid
// från UploadThing och låses till den värden.
const CartItemSchema = z.object({
  productId: z.string().min(1).max(100),
  title: z.string().min(1).max(300),
  quantity: z.number().int().positive().max(10000),
  price: z.number().positive().max(1_000_000),
  // Otillåtna URL:er droppas tyst – en manipulerad order går igenom utan
  // designbild i stället för att kunna smuggla in t.ex. `javascript:`-länkar.
  customImageUrl: uploadUrlSchema.optional().catch(undefined),
  selectedVariant: z.string().max(200).optional(),
});

const CartItemsSchema = z.array(CartItemSchema).min(1).max(100);

// Fri text som sparas i ordern – begränsad längd så en manipulerad
// beställning inte kan fylla databasen eller mejlmallen.
const shortText = z.string().trim().min(1).max(200);
const optionalShortText = z.string().trim().max(200).optional();

const CreateOrderSchema = z.object({
  firstName: shortText,
  lastName: shortText,
  email: z.string().trim().email().max(200),
  phone: optionalShortText,
  company: optionalShortText,
  orgNumber: optionalShortText,
  address: shortText,
  postalCode: shortText,
  city: shortText,
  invoiceAddress: optionalShortText,
  invoicePostalCode: optionalShortText,
  invoiceCity: optionalShortText,
  notes: z.string().trim().max(2000).optional(),
  items: CartItemsSchema,
  buyerType: z.enum(["private", "company"]).catch("private"),
});

export type CreateOrderInput = z.input<typeof CreateOrderSchema>;

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(values: unknown) {
  await checkRateLimit("order", { windowMs: 15 * 60 * 1000, max: 10 });

  const parsed = CreateOrderSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Ogiltiga uppgifter i beställningen");
  }
  const data = parsed.data;
  const buyerType: BuyerType = data.buyerType;

  // Priser och produktinfo sätts aldrig av klienten – slå upp produktens
  // faktiska pris/tillägg i databasen så att en manipulerad beställning inte
  // kan ge en annan totalsumma eller titel än den riktiga.
  const products = await prisma.product.findMany({
    where: { id: { in: data.items.map((item) => item.productId) } },
  });
  const productsById = new Map(products.map((p) => [p.id, p]));

  const validatedItems = data.items.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) {
      throw new Error(`Produkten "${item.title}" finns inte längre`);
    }

    const priceTiers =
      (product.prices as { quantity: number; price: number }[]) ?? [];
    const tier = priceTiers.find((t) => t.quantity === item.quantity);
    if (!tier) {
      throw new Error(`Ogiltigt antal för "${product.title}"`);
    }

    let surcharge = 0;
    if (item.selectedVariant) {
      const variantOptions =
        (product.variantOptions as { name: string; surcharge: number }[]) ?? [];
      const variant = variantOptions.find(
        (v) => v.name === item.selectedVariant,
      );
      if (!variant) {
        throw new Error(`Ogiltig variant för "${product.title}"`);
      }
      surcharge = variant.surcharge;
    }

    return {
      productId: product.id,
      title: product.title,
      quantity: item.quantity,
      price: getDisplayPrice(tier.price + surcharge, buyerType),
      image: product.images[0] ?? undefined,
      customImageUrl: item.customImageUrl,
      selectedVariant: item.selectedVariant,
    };
  });

  const totalPrice = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Koppla ordern till en inloggad användare om det finns en session.
  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    userId = session?.user?.id ?? null;
  } catch {
    // Gästbeställning – helt okej.
  }

  let order;
  try {
    order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        customerName: `${data.firstName} ${data.lastName}`.trim(),
        customerLastName: data.lastName,
        customerEmail: data.email,
        customerPhone: data.phone || null,
        customerCompany: data.company || null,
        orgNumber: data.orgNumber || null,
        customerAddress: data.address,
        customerPostalCode: data.postalCode,
        customerCity: data.city,
        invoiceAddress: data.invoiceAddress || null,
        invoicePostalCode: data.invoicePostalCode || null,
        invoiceCity: data.invoiceCity || null,
        items: validatedItems,
        totalPrice,
        customerType: buyerType,
        notes: data.notes || null,
        status: "pending",
        handled: false,
        shipped: false,
        invoiceSent: false,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Kunde inte skapa beställning");
  }

  revalidatePath("/admin/offerter");

  try {
    await sendEmail({
      to: data.email,
      subject: `Orderbekräftelse ${order.orderNumber} – SweetTime UF`,
      html: orderConfirmationEmail({
        firstName: data.firstName,
        orderNumber: order.orderNumber,
        items: validatedItems,
        totalPrice,
        buyerType,
        deliveryAddress: {
          address: data.address,
          postalCode: data.postalCode,
          city: data.city,
        },
      }),
    });
  } catch (emailError) {
    console.error("Kunde inte skicka orderbekräftelse:", emailError);
  }

  return {
    success: true,
    orderNumber: order.orderNumber,
    orderId: order.id,
  };
}
