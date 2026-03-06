"use client";

import { useCart } from "@/contexts/cart-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { createOrder } from "./actions";

const CheckoutSchema = z.object({
  firstName: z.string().min(1, "Förnamn krävs"),
  lastName: z.string().min(1, "Efternamn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().min(1, "Telefonnummer krävs"),
  company: z.string().optional(),
  orgNumber: z.string().optional(),
  // Leveransadress
  address: z.string().min(1, "Gatuadress krävs"),
  postalCode: z.string().min(1, "Postnummer krävs"),
  city: z.string().min(1, "Ort krävs"),
  // Fakturaadress (om annan)
  sameInvoiceAddress: z.boolean(),
  invoiceAddress: z.string().optional(),
  invoicePostalCode: z.string().optional(),
  invoiceCity: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sameAddress, setSameAddress] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: { sameInvoiceAddress: true },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    startTransition(async () => {
      try {
        const result = await createOrder({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          orgNumber: data.orgNumber,
          address: data.address,
          postalCode: data.postalCode,
          city: data.city,
          invoiceAddress: sameAddress ? undefined : data.invoiceAddress,
          invoicePostalCode: sameAddress ? undefined : data.invoicePostalCode,
          invoiceCity: sameAddress ? undefined : data.invoiceCity,
          notes: data.notes,
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
        <Button onClick={() => router.push("/produkter")}>Fortsätt handla</Button>
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
          {/* Namn */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Förnamn *</label>
              <input
                {...register("firstName")}
                type="text"
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="Förnamn"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Efternamn *</label>
              <input
                {...register("lastName")}
                type="text"
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="Efternamn"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
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
            <label className="block text-sm font-medium mb-1">Telefonnummer *</label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="070-123 45 67"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">Organisationsnummer</label>
              <input
                {...register("orgNumber")}
                type="text"
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="556XXX-XXXX"
              />
            </div>
          </div>

          {/* Leveransadress */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Leveransadress</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Gatuadress *</label>
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
            </div>
          </div>

          {/* Fakturaadress */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="sameAddress"
                checked={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="sameAddress" className="text-sm font-medium">
                Fakturaadress samma som leveransadress
              </label>
            </div>

            {!sameAddress && (
              <div className="space-y-3">
                <h3 className="font-semibold">Fakturaadress</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Gatuadress</label>
                  <input
                    {...register("invoiceAddress")}
                    type="text"
                    className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                    placeholder="Fakturaadress 123"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Postnummer</label>
                    <input
                      {...register("invoicePostalCode")}
                      type="text"
                      className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                      placeholder="123 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ort</label>
                    <input
                      {...register("invoiceCity")}
                      type="text"
                      className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                      placeholder="Stockholm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Övrig information
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
              placeholder="Eventuella önskemål..."
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
