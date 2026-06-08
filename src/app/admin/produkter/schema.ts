import { z } from "zod";

export const PriceTierSchema = z.object({
  quantity: z.number().min(1, "Antal måste vara minst 1"),
  price: z.number().min(0, "Pris måste vara minst 0"),
});

export const VariantOptionSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  surcharge: z.number().min(0, "Pristillägg måste vara 0 eller mer"),
});

export const PrintTemplateSchema = z.object({
  label: z.string().min(1, "Etikett krävs"),
  url: z.string().url("Ange en giltig URL").or(z.literal("")),
});

export const ProductSchema = z.object({
  title: z.string().min(1, "Titel krävs").max(200, "Titel får vara max 200 tecken"),
  articleNumber: z.string().optional(),
  summary: z.string().optional(),
  information: z.string().optional(),
  prices: z.array(PriceTierSchema),
  aboutProduct: z.string().optional(),
  images: z.array(z.object({ url: z.string() })),
  allowCustomerUpload: z.boolean().optional(),
  categoryId: z.string().optional(),
  variantLabel: z.string().optional(),
  variants: z.array(VariantOptionSchema).optional(),
  printTemplates: z.array(PrintTemplateSchema).optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
