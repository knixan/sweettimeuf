"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Inget ordernummer hittades</p>
        <Link href="/">
          <Button>Tillbaka till startsidan</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Tack för din beställning!</h1>
      
      <div className="bg-card border rounded-lg p-6 mb-6 max-w-md mx-auto">
        <p className="text-muted-foreground mb-2">Ditt ordernummer</p>
        <p className="text-3xl font-bold text-primary">{orderNumber}</p>
      </div>

      <div className="space-y-4 max-w-lg mx-auto text-left">
        <p className="text-muted-foreground">
          Vi har tagit emot din beställning och kommer att behandla den så snart som möjligt.
        </p>
        <p className="text-muted-foreground">
          En bekräftelse har skickats till din e-postadress. Du kommer att få en faktura separat.
        </p>
        <p className="text-muted-foreground">
          Om du har frågor om din beställning, vänligen kontakta oss med ditt ordernummer.
        </p>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Link href="/produkt">
          <Button variant="outline">Fortsätt handla</Button>
        </Link>
        <Link href="/">
          <Button>Tillbaka till startsidan</Button>
        </Link>
      </div>
    </div>
  );
}
