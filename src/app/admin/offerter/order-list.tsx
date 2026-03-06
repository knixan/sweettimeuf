"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, updateOrderFlags, removeCustomerImage } from "./actions";
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
};

export function OrderList({ orders }: { orders: Order[] }) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success("Status uppdaterad");
    } catch {
      toast.error("Kunde inte uppdatera status");
    }
  };

  const handleFlagChange = async (
    orderId: string,
    flag: "handled" | "shipped" | "invoiceSent",
    value: boolean
  ) => {
    try {
      await updateOrderFlags(orderId, { [flag]: value });
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, [flag]: value } : o))
      );
      toast.success("Uppdaterat");
    } catch {
      toast.error("Kunde inte uppdatera");
    }
  };

  const handleRemoveImage = async (orderId: string, productId: string) => {
    if (!confirm("Är du säker på att du vill ta bort kundens uppladdade bild?")) {
      return;
    }

    try {
      await removeCustomerImage(orderId, productId);
      toast.success("Bilden har tagits bort");
      window.location.reload();
    } catch {
      toast.error("Kunde inte ta bort bilden");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Väntande";
      case "processing": return "Behandlas";
      case "completed": return "Klar";
      case "cancelled": return "Avbruten";
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      {localOrders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Inga ordrar ännu</p>
      ) : (
        localOrders.map((order) => {
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
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    {isExpanded ? "Dölj" : "Visa"} detaljer
                  </Button>
                </div>
              </div>

              {/* Flags / checkboxes */}
              <div className="flex flex-wrap gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={order.handled}
                    onChange={(e) => handleFlagChange(order.id, "handled", e.target.checked)}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                  />
                  <span className={`text-sm font-medium ${order.handled ? "text-green-600" : "text-muted-foreground"}`}>
                    Hanterad
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={order.shipped}
                    onChange={(e) => handleFlagChange(order.id, "shipped", e.target.checked)}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                  />
                  <span className={`text-sm font-medium ${order.shipped ? "text-green-600" : "text-muted-foreground"}`}>
                    Skickad
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={order.invoiceSent}
                    onChange={(e) => handleFlagChange(order.id, "invoiceSent", e.target.checked)}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                  />
                  <span className={`text-sm font-medium ${order.invoiceSent ? "text-green-600" : "text-muted-foreground"}`}>
                    Faktura skickad
                  </span>
                </label>
              </div>

              {/* Customer Info Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Kund</p>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  {order.customerCompany && (
                    <p className="text-sm text-muted-foreground">{order.customerCompany}</p>
                  )}
                  {order.orgNumber && (
                    <p className="text-sm text-muted-foreground">Org.nr: {order.orgNumber}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Kontakt</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                  {order.customerPhone && (
                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">Totalt</p>
                  <p className="text-lg font-bold">{order.totalPrice.toFixed(2)} kr</p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t pt-4 space-y-4">
                  {/* Addresses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Leveransadress</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerAddress}<br />
                        {order.customerPostalCode} {order.customerCity}
                      </p>
                    </div>
                    {(order.invoiceAddress || order.invoicePostalCode) && (
                      <div>
                        <p className="text-sm font-medium mb-1">Fakturaadress</p>
                        <p className="text-sm text-muted-foreground">
                          {order.invoiceAddress}<br />
                          {order.invoicePostalCode} {order.invoiceCity}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="text-sm font-medium mb-2">Produkter</p>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-4 bg-muted/30 p-3 rounded-lg">
                          {item.image && (
                            <div className="relative w-20 h-20 shrink-0 bg-white rounded">
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
                              {item.quantity} st × {item.price.toFixed(2)} kr = {(item.quantity * item.price).toFixed(2)} kr
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
                                    onClick={() => handleRemoveImage(order.id, item.productId)}
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

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Anteckningar från kund</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded">
                        {order.notes}
                      </p>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div>
                    <p className="text-sm font-medium mb-2">Ändra status</p>
                    <div className="flex gap-2 flex-wrap">
                      {["pending", "processing", "completed", "cancelled"].map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={order.status === s ? (s === "cancelled" ? "destructive" : "default") : "outline"}
                          onClick={() => handleStatusChange(order.id, s)}
                        >
                          {getStatusText(s)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
