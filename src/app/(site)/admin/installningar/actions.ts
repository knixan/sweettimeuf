"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const COMPANY_SETTINGS_ID = "company-settings";

const CompanySettingsSchema = z.object({
  companyName: z.string().min(1, "Företagsnamn krävs"),
  orgNumber: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  swishNumber: z.string().optional(),
  bankgiroNumber: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function getCompanySettings() {
  await requireAdmin();

  const settings = await prisma.companySettings.findUnique({
    where: { id: COMPANY_SETTINGS_ID },
  });

  return (
    settings ?? {
      id: COMPANY_SETTINGS_ID,
      companyName: "SweetTime UF",
      orgNumber: null,
      address: null,
      postalCode: null,
      city: null,
      swishNumber: null,
      bankgiroNumber: null,
      logoUrl: null,
    }
  );
}

export async function updateCompanySettings(values: unknown) {
  await requireAdmin();

  const parsed = CompanySettingsSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Ogiltiga värden");
  }
  const data = parsed.data;

  await prisma.companySettings.upsert({
    where: { id: COMPANY_SETTINGS_ID },
    create: { id: COMPANY_SETTINGS_ID, ...data },
    update: data,
  });

  revalidatePath("/admin/installningar");
  return { success: true };
}
