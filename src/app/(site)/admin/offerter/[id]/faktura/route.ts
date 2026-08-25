import { requireAdmin } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/invoice-pdf";
import { NextResponse } from "next/server";

const COMPANY_SETTINGS_ID = "company-settings";

async function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: { invoiceNumber: { startsWith: `F-${year}-` } },
  });
  return `F-${year}-${String(count + 1).padStart(4, "0")}`;
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
    invoiceNumber = await nextInvoiceNumber();
    invoiceGeneratedAt = new Date();
    await prisma.order.update({
      where: { id },
      data: { invoiceNumber, invoiceGeneratedAt },
    });
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
