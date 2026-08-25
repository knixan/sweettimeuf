import { requireAdmin } from "@/lib/server-auth";
import { getOrderForEdit } from "../../actions";
import { EditOrderForm } from "./edit-order-form";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderForEdit(id);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Redigera order {order.orderNumber}
        </h1>
        <EditOrderForm order={order} />
      </div>
    </main>
  );
}
