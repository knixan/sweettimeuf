"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductFormData } from "./schema";
import { updateProduct, getProductForEdit } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
};

type ProductData = {
  id: string;
  title: string;
  articleNumber: string | null;
  summary: string | null;
  information: string | null;
  prices: unknown;
  aboutProduct: unknown;
  images: string[];
  allowCustomerUpload: boolean;
  categoryId: string | null;
};

type EditProductFormProps = {
  productId: string;
  onClose: () => void;
};

export function EditProductForm({ productId, onClose }: EditProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProductForEdit(productId);
        setProduct(data.product);
        setCategories(data.categories);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Kunde inte ladda produkt");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        articleNumber: product.articleNumber || "",
        summary: product.summary || "",
        information: product.information || "",
        prices: (product.prices as { quantity: number; price: number }[]) || [],
        aboutProduct: (product.aboutProduct as Record<string, string>) || {},
        images: product.images.length > 0 ? product.images.map((url) => ({ url })) : [{ url: "" }],
        allowCustomerUpload: product.allowCustomerUpload,
        categoryId: product.categoryId || "",
      });
    }
  }, [product, reset]);

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
        const filteredData = {
          ...data,
          images: data.images?.map((i) => i.url).filter((url) => url && url.trim() !== ""),
        };

        await updateProduct(productId, filteredData);
        toast.success("Produkten uppdaterades!");
        router.refresh();
        onClose();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Kunde inte uppdatera produkt");
      }
    });
  };

  if (loading) {
    return <div className="p-4">Laddar...</div>;
  }

  if (!product) {
    return <div className="p-4">Kunde inte hitta produkt</div>;
  }

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Redigera produkt</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titel *</label>
          <input
            {...register("title")}
            type="text"
            className="w-full rounded-md bg-background border border-input px-3 py-2"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Art. nummer</label>
          <input
            {...register("articleNumber")}
            type="text"
            className="w-full rounded-md bg-background border border-input px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            {...register("categoryId")}
            className="w-full rounded-md bg-background border border-input px-3 py-2"
          >
            <option value="">Ingen kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sammanfattning</label>
          <textarea
            {...register("summary")}
            rows={3}
            className="w-full rounded-md bg-background border border-input px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Information</label>
          <textarea
            {...register("information")}
            rows={4}
            className="w-full rounded-md bg-background border border-input px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pris och antal</label>
          <div className="space-y-2">
            {priceFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`prices.${index}.quantity`, { valueAsNumber: true })}
                  type="number"
                  placeholder="Antal"
                  className="w-1/2 rounded-md bg-background border border-input px-2 py-1 text-sm"
                />
                <input
                  {...register(`prices.${index}.price`, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="Pris"
                  className="w-1/2 rounded-md bg-background border border-input px-2 py-1 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePrice(index)}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPrice({ quantity: 0, price: 0 })}
            >
              + Prisrad
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Om produkten</label>
          <textarea
            {...register("aboutProduct")}
            rows={6}
            placeholder="Minsta order, hållbarhet, förpackning, leveranstid..."
            className="w-full rounded-md bg-background border border-input px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bilder</label>
          <div className="space-y-1">
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`images.${index}.url`)}
                  type="url"
                  placeholder="https://..."
                  className="flex-1 rounded-md bg-background border border-input px-2 py-1 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendImage({ url: "" })}
            >
              + Bild
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register("allowCustomerUpload")}
            type="checkbox"
            id={`allowUpload-${productId}`}
            className="rounded border-input"
          />
          <label htmlFor={`allowUpload-${productId}`} className="text-sm">
            Tillåt kunduppladdning
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Sparar..." : "Spara"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </form>
    </div>
  );
}

