import { CheckoutForm } from "./checkout-form";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Kassa</h1>
        <CheckoutForm />
      </div>
    </main>
  );
}
