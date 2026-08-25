"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateOrder } from "../../actions";
import { toast } from "sonner";

type CartItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
  customImageUrl?: string;
  selectedVariant?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerLastName: string | null;
  customerEmail: string;
  customerPhone: string | null;
  customerCompany: string | null;
  orgNumber: string | null;
  customerAddress: string;
  customerPostalCode: string;
  customerCity: string;
  invoiceAddress: string | null;
  invoicePostalCode: string | null;
  invoiceCity: string | null;
  items: unknown;
  notes: string | null;
};

function newManualItem(): CartItem {
  return {
    productId: `manual-${crypto.randomUUID()}`,
    title: "",
    quantity: 1,
    price: 0,
  };
}

export function EditOrderForm({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<CartItem[]>(
    (order.items as CartItem[]) ?? [],
  );
  const [form, setForm] = useState({
    customerName: order.customerName,
    customerLastName: order.customerLastName ?? "",
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone ?? "",
    customerCompany: order.customerCompany ?? "",
    orgNumber: order.orgNumber ?? "",
    customerAddress: order.customerAddress,
    customerPostalCode: order.customerPostalCode,
    customerCity: order.customerCity,
    invoiceAddress: order.invoiceAddress ?? "",
    invoicePostalCode: order.invoicePostalCode ?? "",
    invoiceCity: order.invoiceCity ?? "",
    notes: order.notes ?? "",
  });

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const updateItem = (index: number, patch: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Ordern måste ha minst en rad");
      return;
    }
    startTransition(async () => {
      try {
        await updateOrder(order.id, { ...form, items });
        toast.success("Order uppdaterad");
        router.push("/admin/offerter");
      } catch {
        toast.error("Kunde inte uppdatera order");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Kunduppgifter</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName" className="mb-2">
              Förnamn
            </Label>
            <Input
              id="customerName"
              value={form.customerName}
              onChange={set("customerName")}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerLastName" className="mb-2">
              Efternamn
            </Label>
            <Input
              id="customerLastName"
              value={form.customerLastName}
              onChange={set("customerLastName")}
            />
          </div>
          <div>
            <Label htmlFor="customerEmail" className="mb-2">
              E-post
            </Label>
            <Input
              id="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={set("customerEmail")}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPhone" className="mb-2">
              Telefon
            </Label>
            <Input
              id="customerPhone"
              value={form.customerPhone}
              onChange={set("customerPhone")}
            />
          </div>
          <div>
            <Label htmlFor="customerCompany" className="mb-2">
              Företag
            </Label>
            <Input
              id="customerCompany"
              value={form.customerCompany}
              onChange={set("customerCompany")}
            />
          </div>
          <div>
            <Label htmlFor="orgNumber" className="mb-2">
              Org.nr
            </Label>
            <Input
              id="orgNumber"
              value={form.orgNumber}
              onChange={set("orgNumber")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Leveransadress</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <Label htmlFor="customerAddress" className="mb-2">
              Adress
            </Label>
            <Input
              id="customerAddress"
              value={form.customerAddress}
              onChange={set("customerAddress")}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPostalCode" className="mb-2">
              Postnummer
            </Label>
            <Input
              id="customerPostalCode"
              value={form.customerPostalCode}
              onChange={set("customerPostalCode")}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerCity" className="mb-2">
              Ort
            </Label>
            <Input
              id="customerCity"
              value={form.customerCity}
              onChange={set("customerCity")}
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Fakturaadress (om annan)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <Label htmlFor="invoiceAddress" className="mb-2">
              Adress
            </Label>
            <Input
              id="invoiceAddress"
              value={form.invoiceAddress}
              onChange={set("invoiceAddress")}
            />
          </div>
          <div>
            <Label htmlFor="invoicePostalCode" className="mb-2">
              Postnummer
            </Label>
            <Input
              id="invoicePostalCode"
              value={form.invoicePostalCode}
              onChange={set("invoicePostalCode")}
            />
          </div>
          <div>
            <Label htmlFor="invoiceCity" className="mb-2">
              Ort
            </Label>
            <Input
              id="invoiceCity"
              value={form.invoiceCity}
              onChange={set("invoiceCity")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Rader</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setItems((prev) => [...prev, newManualItem()])}
          >
            + Lägg till rad
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.productId + index}
              className="grid grid-cols-12 gap-2 items-end bg-muted/30 p-3 rounded-lg"
            >
              <div className="col-span-12 md:col-span-5">
                <Label className="mb-1 text-xs">Beskrivning</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Label className="mb-1 text-xs">Variant</Label>
                <Input
                  value={item.selectedVariant ?? ""}
                  onChange={(e) =>
                    updateItem(index, {
                      selectedVariant: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <Label className="mb-1 text-xs">Antal</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, {
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Label className="mb-1 text-xs">Pris/st (kr)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, {
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="col-span-4 md:col-span-1 text-sm text-muted-foreground">
                {(item.price * item.quantity).toFixed(2)} kr
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  X
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-right text-lg font-bold">
          Totalt: {total.toFixed(2)} kr
        </div>
      </section>

      <section>
        <Label htmlFor="notes" className="mb-2">
          Anteckningar
        </Label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="w-full rounded-md bg-input/10 border border-input px-3 py-2 min-h-24"
        />
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sparar..." : "Spara ändringar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/offerter")}
        >
          Avbryt
        </Button>
      </div>
    </form>
  );
}
