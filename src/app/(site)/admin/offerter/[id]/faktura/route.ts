import { requireAdmin } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/invoice-pdf";
import { NextResponse } from "next/server";

const COMPANY_SETTINGS_ID = "company-settings";

/**
 * Sätter fakturanummer på ordern första gången (löpnummer per år). Räknar om
 * och försöker igen om två samtidiga anrop råkar välja samma nummer – den
 * unika kolumnen `invoiceNumber` garanterar att inget nummer dubbleras.
 */
async function assignInvoiceNumber(orderId: string): Promise<{
  invoiceNumber: string;
  invoiceGeneratedAt: Date;
}> {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 5; attempt++) {
    const count = await prisma.order.count({
      where: { invoiceNumber: { startsWith: `F-${year}-` } },
    });
    const invoiceNumber = `F-${year}-${String(count + 1).padStart(4, "0")}`;
    const invoiceGeneratedAt = new Date();

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { invoiceNumber, invoiceGeneratedAt },
      });
      return { invoiceNumber, invoiceGeneratedAt };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue; // nummret togs av ett samtidigt anrop – räkna om
      }
      throw error;
    }
  }

  throw new Error("Kunde inte tilldela fakturanummer");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order hittades inte" }, { status: 404 });
  }

  let invoiceNumber = order.invoiceNumber;
  let invoiceGeneratedAt = order.invoiceGeneratedAt;
  if (!invoiceNumber) {
    ({ invoiceNumber, invoiceGeneratedAt } = await assignInvoiceNumber(id));
  }

  const settings = (await prisma.companySettings.findUnique({
    where: { id: COMPANY_SETTINGS_ID },
  })) ?? {
    companyName: "SweetTime UF",
    orgNumber: null,
    address: null,
    postalCode: null,
    city: null,
    swishNumber: null,
    bankgiroNumber: null,
    logoUrl: null,
  };

  const buffer = await renderToBuffer(
    InvoiceDocument({
      order: {
        orderNumber: order.orderNumber,
        invoiceNumber,
        createdAt: order.createdAt,
        invoiceGeneratedAt: invoiceGeneratedAt ?? new Date(),
        customerName: order.customerName,
        customerCompany: order.customerCompany,
        orgNumber: order.orgNumber,
        customerEmail: order.customerEmail,
        invoiceAddress: order.invoiceAddress,
        invoicePostalCode: order.invoicePostalCode,
        invoiceCity: order.invoiceCity,
        customerAddress: order.customerAddress,
        customerPostalCode: order.customerPostalCode,
        customerCity: order.customerCity,
        items: order.items as {
          title: string;
          quantity: number;
          price: number;
          selectedVariant?: string;
        }[],
        totalPrice: order.totalPrice,
        customerType: order.customerType,
      },
      settings,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="faktura-${invoiceNumber}.pdf"`,
    },
  });
}
