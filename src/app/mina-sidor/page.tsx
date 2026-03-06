import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

type CartItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
};

function getStatusLabel(order: { handled: boolean; shipped: boolean }) {
  if (order.shipped)
    return { text: "Skickad", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
  if (order.handled)
    return { text: "Hanteras", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
  return { text: "Ohanterad", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
}

export default async function MinaSidorPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/logga-in");
  }

  const user = session.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mina Sidor</h1>

        {/* Profil */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profilinformation</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Namn</p>
              <p className="text-lg">{user.name || "Ej angivet"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-post</p>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Ordrar */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Mina beställningar</h2>

          {orders.length === 0 ? (
            <div className="bg-card rounded-lg border p-8 text-center">
              <p className="text-muted-foreground mb-4">Du har inga beställningar ännu.</p>
              <Link
                href="/produkter"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Se produkter
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const items = order.items as CartItem[];
                const statusInfo = getStatusLabel(order);

                return (
                  <div key={order.id} className="bg-card rounded-lg border p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-semibold text-lg">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("sv-SE", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap justify-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        <p className="font-bold text-lg">{order.totalPrice.toFixed(2)} kr</p>
                      </div>
                    </div>

                    <div className="space-y-1 border-t pt-3">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.title} × {item.quantity}
                          </span>
                          <span>{(item.price * item.quantity).toFixed(2)} kr</span>
                        </div>
                      ))}
                    </div>

                    {order.invoiceSent && (
                      <p className="mt-3 text-sm text-green-600 font-medium">✓ Faktura skickad</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
