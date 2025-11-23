"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductFormData } from "../schema";
import { createProduct } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
};

export function CreateProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      prices: [{ quantity: 100, price: 0 }],
      images: [""],
      allowCustomerUpload: false,
    },
  });

  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control,
    name: "prices",
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const onSubmit = async (data: ProductFormData) => {
    startTransition(async () => {
      try {
        // Filter out empty images
        const filteredData = {
          ...data,
          images: data.images?.filter((img) => img && img.trim() !== ""),
        };

        await createProduct(filteredData);
        toast.success("Produkten skapades!");
        router.push("/admin/produkter");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Kunde inte skapa produkt");
      }
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg border">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Titel */}
        <div>
          <label className="block text-sm font-medium mb-2">Titel *</label>
          <input
            {...register("title")}
            type="text"
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="Tablettaskar — 7010-1"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Art. nummer */}
        <div>
          <label className="block text-sm font-medium mb-2">Art. nummer</label>
          <input
            {...register("articleNumber")}
            type="text"
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="7010-1"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium mb-2">Kategori</label>
          <select
            {...register("categoryId")}
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          >
            <option value="">Ingen kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sammanfattning */}
        <div>
          <label className="block text-sm font-medium mb-2">Sammanfattning</label>
          <textarea
            {...register("summary")}
            rows={4}
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="En storsäljare för både barn och vuxna. Fyll med mjuka tuggisar eller hårda tabletter..."
          />
        </div>

        {/* Om produkten */}
        <div>
          <label className="block text-sm font-medium mb-2">Om produkten</label>
          <textarea
            {...register("information")}
            rows={6}
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="Finns i flera smaker:&#10;- Frukttoppar&#10;- Skittles Frukt&#10;- Frukttugg"
          />
        </div>

        {/* Pris och antal */}
        <div>
          <label className="block text-sm font-medium mb-2">Pris och antal</label>
          <div className="space-y-2">
            {priceFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`prices.${index}.quantity`, { valueAsNumber: true })}
                  type="number"
                  placeholder="Antal (t.ex. 100)"
                  className="w-1/2 rounded-md bg-input/10 border border-input px-3 py-2"
                />
                <input
                  {...register(`prices.${index}.price`, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="Pris (kr)"
                  className="w-1/2 rounded-md bg-input/10 border border-input px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removePrice(index)}
                  disabled={priceFields.length === 1}
                >
                  Ta bort
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendPrice({ quantity: 0, price: 0 })}
            >
              + Lägg till prisrad
            </Button>
          </div>
        </div>

        {/* Information */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium mb-2">Information</label>
          <textarea
            {...register("aboutProduct")}
            rows={8}
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="Minsta order: 100 st&#10;Hållbarhet: 12 månader&#10;Förpackning: 50, 100 eller 250 askar&#10;Leveranstid: ca 2 veckor från godkänt korrektur&#10;Expressorder: 1 vecka, tillägg 1500 kr/order&#10;Klichékostnad: 1000 kr/design (CMYK)&#10;Repetitionsorder: 500 kr/design"
          />
        </div>

        {/* Bilder */}
        <div>
          <label className="block text-sm font-medium mb-2">Bilder (URL)</label>
          <div className="space-y-2">
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`images.${index}`)}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-md bg-input/10 border border-input px-3 py-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeImage(index)}
                  disabled={imageFields.length === 1}
                >
                  Ta bort
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendImage("")}>
              + Lägg till bild
            </Button>
          </div>
        </div>

        {/* Tillåt kunduppladdning */}
        <div className="flex items-center gap-2">
          <input
            {...register("allowCustomerUpload")}
            type="checkbox"
            id="allowCustomerUpload"
            className="rounded border-input"
          />
          <label htmlFor="allowCustomerUpload" className="text-sm font-medium">
            Tillåt kund att ladda upp bild innan kassan
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Skapar..." : "Skapa produkt"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/produkter")}
          >
            Avbryt
          </Button>
        </div>
      </form>
    </div>
  );
}
