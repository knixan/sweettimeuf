"use client";

import { useCart } from "@/contexts/cart-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { createOrder } from "./actions";

const CheckoutSchema = z.object({
  name: z.string().min(2, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().min(1, "Adress krävs"),
  postalCode: z.string().min(1, "Postnummer krävs"),
  city: z.string().min(1, "Ort krävs"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    startTransition(async () => {
      try {
        const result = await createOrder({
          ...data,
          items,
          totalPrice,
        });

        clearCart();
        router.push(`/orderbekraftelse?orderNumber=${result.orderNumber}`);
      } catch (error) {
        console.error("Order error:", error);
        const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod vid beställning";
        toast.error(errorMessage);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Din kassa är tom</p>
        <Button onClick={() => router.push("/produkt")}>Fortsätt handla</Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Din beställning</h2>
        <div className="bg-card border rounded-lg p-4 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border-b pb-4">
              {item.image && (
                <div className="relative w-20 h-20 shrink-0 bg-muted rounded">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} st × {item.price.toFixed(2)} kr
                </p>
                {item.customImageUrl && (
                  <div className="mt-2 p-2 bg-primary/10 rounded">
                    <p className="text-xs font-semibold text-primary">
                      ✓ Egen design bifogad
                    </p>
                  </div>
                )}
                <p className="font-semibold mt-1">
                  {(item.quantity * item.price).toFixed(2)} kr
                </p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Totalt:</span>
              <span>{totalPrice.toFixed(2)} kr</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              * Faktura skickas manuellt efter beställning
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info Form */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Dina uppgifter</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Namn *</label>
            <input
              {...register("name")}
              type="text"
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="Förnamn Efternamn"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-post *</label>
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="din@email.se"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="070-123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Företag</label>
            <input
              {...register("company")}
              type="text"
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="Företagsnamn AB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adress *</label>
            <input
              {...register("address")}
              type="text"
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="Gatuadress 123"
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Postnummer *</label>
              <input
                {...register("postalCode")}
                type="text"
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="123 45"
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ort *</label>
              <input
                {...register("city")}
                type="text"
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="Stockholm"
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Övrig information
            </label>
            <textarea
              {...register("notes")}
              rows={4}
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="Eventuella önskemål eller information..."
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Skickar beställning..." : "Skicka beställning"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Genom att skicka beställningen godkänner du våra villkor. Du kommer
            att få en faktura via e-post.
          </p>
        </form>
      </div>
    </div>
  );
}
