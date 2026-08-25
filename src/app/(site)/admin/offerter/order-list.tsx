"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { updateOrderFlags, removeCustomerImage, deleteOrder } from "./actions";
import { toast } from "sonner";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
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
  totalPrice: number;
  customerType: string;
  status: string;
  handled: boolean;
  shipped: boolean;
  invoiceSent: boolean;
  notes: string | null;
  createdAt: Date;
};

type CartItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
  customImageUrl?: string;
  selectedVariant?: string;
};

type Filter = "alla" | "ohanterad" | "hanterad" | "skickad" | "faktura";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "alla", label: "Alla" },
  { key: "ohanterad", label: "Ohanterad" },
  { key: "hanterad", label: "Hanterad" },
  { key: "skickad", label: "Skickad" },
  { key: "faktura", label: "Faktura skickad" },
];

function applyFilter(orders: Order[], filter: Filter) {
  switch (filter) {
    case "ohanterad":
      return orders.filter((o) => !o.handled && !o.shipped);
    case "hanterad":
      return orders.filter((o) => o.handled && !o.shipped);
    case "skickad":
      return orders.filter((o) => o.shipped);
    case "faktura":
      return orders.filter((o) => o.invoiceSent);
    default:
      return orders;
  }
}

function applySearch(orders: Order[], search: string) {
  const term = search.trim().toLowerCase();
  if (!term) return orders;
  return orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerEmail.toLowerCase().includes(term) ||
      (o.customerCompany?.toLowerCase().includes(term) ?? false),
  );
}

export function OrderList({ orders }: { orders: Order[] }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);
  const [activeFilter, setActiveFilter] = useState<Filter>("alla");
  const [search, setSearch] = useState("");

  const filtered = applySearch(applyFilter(localOrders, activeFilter), search);

  const handleFlagChange = async (
    orderId: string,
    flag: "handled" | "shipped" | "invoiceSent",
    value: boolean,
  ) => {
    try {
      await updateOrderFlags(orderId, { [flag]: value });
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, [flag]: value } : o)),
      );
      toast.success("Uppdaterat");
    } catch {
      toast.error("Kunde inte uppdatera");
    }
  };

  const handleRemoveImage = async (orderId: string, productId: string) => {
    if (!confirm("Är du säker på att du vill ta bort kundens uppladdade bild?"))
      return;
    try {
      await removeCustomerImage(orderId, productId);
      toast.success("Bilden har tagits bort");
      window.location.reload();
    } catch {
      toast.error("Kunde inte ta bort bilden");
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (
      !confirm(
        `Är du säker på att du vill ta bort offert ${orderNumber}? Detta kan inte ångras.`,
      )
    )
      return;
    const result = await deleteOrder(orderId);
    if (result.ok) {
      setLocalOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Offerten togs bort");
    } else {
      toast.error("Kunde inte ta bort offerten");
    }
  };

  const getStatusFromFlags = (order: Order) => {
    if (order.invoiceSent)
      return {
        label: "Faktura skickad",
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      };
    if (order.shipped)
      return {
        label: "Skickad",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      };
    if (order.handled)
      return {
        label: "Hanteras",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };
    return {
      label: "Ohanterad",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
  };

  return (
    <div className="space-y-4">
      {/* Sök */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Sök på ordernummer, namn, e-post eller företag..."
        className="w-full rounded-md bg-input/10 border border-input px-3 py-2 text-sm"
      />

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-70">
              ({applyFilter(localOrders, key).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Inga ordrar att visa
        </p>
      ) : (
        filtered.map((order) => {
          const items = order.items as CartItem[];
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-card border rounded-lg p-6">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("sv-SE")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusFromFlags(order).className}`}
                  >
                    {getStatusFromFlags(order).label}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                  >
                    {isExpanded ? "Dölj" : "Visa"} detaljer
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/offerter/${order.id}/redigera`}>
                      Redigera
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`/admin/offerter/${order.id}/faktura`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Generera faktura
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteOrder(order.id, order.orderNumber)
                    }
                  >
                    Ta bort
                  </Button>
                </div>
              </div>

              {/* Flags / checkboxes */}
              <div className="flex flex-wrap gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                {(["handled", "shipped", "invoiceSent"] as const).map(
                  (flag) => {
                    const labels = {
                      handled: "Hanterad",
                      shipped: "Skickad",
                      invoiceSent: "Faktura skickad",
                    };
                    return (
                      <label
                        key={flag}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={order[flag]}
                          onChange={(e) =>
                            handleFlagChange(order.id, flag, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-input cursor-pointer"
                        />
                        <span
                          className={`text-sm font-medium ${order[flag] ? "text-green-600" : "text-muted-foreground"}`}
                        >
                          {labels[flag]}
                        </span>
                      </label>
                    );
                  },
                )}
              </div>

              {/* Customer Info Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Kund</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName}
                  </p>
                  {order.customerCompany && (
                    <p className="text-sm text-muted-foreground">
                      {order.customerCompany}
                    </p>
                  )}
                  {order.orgNumber && (
                    <p className="text-sm text-muted-foreground">
                      Org.nr: {order.orgNumber}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Kontakt</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerEmail}
                  </p>
                  {order.customerPhone && (
                    <p className="text-sm text-muted-foreground">
                      {order.customerPhone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Totalt</p>
                  <p className="text-lg font-bold">
                    {order.totalPrice.toFixed(2)} kr
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerType === "private"
                      ? "Inkl. moms (privatperson)"
                      : "Exkl. moms (företag/förening)"}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Leveransadress</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerAddress}
                        <br />
                        {order.customerPostalCode} {order.customerCity}
                      </p>
                    </div>
                    {(order.invoiceAddress || order.invoicePostalCode) && (
                      <div>
                        <p className="text-sm font-medium mb-1">
                          Fakturaadress
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.invoiceAddress}
                          <br />
                          {order.invoicePostalCode} {order.invoiceCity}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Produkter</p>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 bg-muted/30 p-3 rounded-lg"
                        >
                          {item.image && (
                            <div className="relative w-20 h-20 shrink-0 bg-white rounded">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="80px"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            {item.selectedVariant && (
                              <p className="text-sm text-muted-foreground font-medium">
                                {item.selectedVariant}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} st × {item.price.toFixed(2)} kr ={" "}
                              {(item.quantity * item.price).toFixed(2)} kr
                            </p>
                            {item.customImageUrl && (
                              <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-primary mb-2">
                                      Kundens design:
                                    </p>
                                    <a
                                      href={item.customImageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline break-all"
                                    >
                                      {item.customImageUrl}
                                    </a>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveImage(
                                        order.id,
                                        item.productId,
                                      )
                                    }
                                  >
                                    Ta bort
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Anteckningar från kund
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
