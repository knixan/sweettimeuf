import { z } from "zod";

export const PriceTierSchema = z.object({
  quantity: z.number().min(1, "Antal måste vara minst 1"),
  price: z.number().min(0, "Pris måste vara minst 0"),
});

export const ProductSchema = z.object({
  title: z.string().min(1, "Titel krävs").max(200, "Titel får vara max 200 tecken"),
  articleNumber: z.string().optional(),
  summary: z.string().optional(),
  information: z.string().optional(),
  prices: z.array(PriceTierSchema).default([]),
  aboutProduct: z.string().optional(),
  images: z.array(z.string()).default([""]),
  allowCustomerUpload: z.boolean().optional(),
  categoryId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
