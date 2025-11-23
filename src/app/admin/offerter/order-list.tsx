"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, removeCustomerImage } from "./actions";
import { toast } from "sonner";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerCompany: string | null;
  customerAddress: string;
  customerPostalCode: string;
  customerCity: string;
  items: unknown;
  totalPrice: number;
  status: string;
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Status uppdaterad");
    } catch (error) {
      toast.error("Kunde inte uppdatera status");
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
    } catch (error) {
      toast.error("Kunde inte ta bort bilden");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Väntande";
      case "processing":
        return "Behandlas";
      case "completed":
        return "Klar";
      case "cancelled":
        return "Avbruten";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Inga ordrar ännu</p>
      ) : (
        orders.map((order) => {
          const items = order.items as CartItem[];
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-card border rounded-lg p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("sv-SE")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
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

              {/* Customer Info Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Kund</p>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  {order.customerCompany && (
                    <p className="text-sm text-muted-foreground">{order.customerCompany}</p>
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
                  {/* Full Address */}
                  <div>
                    <p className="text-sm font-medium mb-1">Leveransadress</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerAddress}<br />
                      {order.customerPostalCode} {order.customerCity}
                    </p>
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
                            
                            {/* Customer Uploaded Image */}
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
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={order.status === "pending" ? "default" : "outline"}
                        onClick={() => handleStatusChange(order.id, "pending")}
                      >
                        Väntande
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === "processing" ? "default" : "outline"}
                        onClick={() => handleStatusChange(order.id, "processing")}
                      >
                        Behandlas
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === "completed" ? "default" : "outline"}
                        onClick={() => handleStatusChange(order.id, "completed")}
                      >
                        Klar
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === "cancelled" ? "destructive" : "outline"}
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                      >
                        Avbruten
                      </Button>
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
