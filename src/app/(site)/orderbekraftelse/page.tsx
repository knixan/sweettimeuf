import { Suspense } from "react";
import { OrderConfirmation } from "./order-confirmation";

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<div>Laddar...</div>}>
          <OrderConfirmation />
        </Suspense>
      </div>
    </main>
  );
}
