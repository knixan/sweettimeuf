import { requireAdminOrEditor } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { OrderList } from "./order-list";

export default async function OrdersPage() {
  await requireAdminOrEditor();

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ordrar</h1>
        <OrderList orders={orders} />
      </div>
    </main>
  );
}
