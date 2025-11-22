"use client";

import { useCart } from "@/contexts/cart-context";
import { ShoppingCart, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function CartDropdown() {
  const { items, totalItems, totalPrice, removeItem } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 hover:bg-accent rounded-md transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Kassa ({totalItems} produkter)</h3>
          
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Kassan är tom
            </p>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 border-b pb-3">
                    {item.image && (
                      <div className="relative w-16 h-16 shrink-0 bg-muted rounded">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} st × {item.price.toFixed(2)} kr
                      </p>
                      <p className="text-sm font-semibold">
                        {(item.quantity * item.price).toFixed(2)} kr
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Totalt:</span>
                  <span>{totalPrice.toFixed(2)} kr</span>
                </div>
                <Link href="/kassa">
                  <Button className="w-full">Gå till kassan</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
