import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SalesChart } from "@/components/admin/sales-chart";

type CartItem = { productId: string; title: string; quantity: number };

const DAYS = 30;

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayKey(d: Date) {
  return startOfDay(d).toISOString().slice(0, 10);
}

async function getDashboardData() {
  const now = new Date();
  const periodStart = startOfDay(new Date(now.getTime() - DAYS * 86400000));
  const previousPeriodStart = startOfDay(
    new Date(now.getTime() - DAYS * 2 * 86400000),
  );

  const [
    recentOrders,
    ordersLast60Days,
    allOrderItems,
    customerCount,
    productCount,
  ] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalPrice: true,
        createdAt: true,
        handled: true,
        shipped: true,
        invoiceSent: true,
      },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: previousPeriodStart } },
      select: { totalPrice: true, createdAt: true },
    }),
    prisma.order.findMany({ select: { items: true } }),
    prisma.user.count({ where: { role: "user" } }),
    prisma.product.count(),
  ]);

  const allOrders = await prisma.order.findMany({
    select: { handled: true, shipped: true, invoiceSent: true },
  });

  const currentPeriodOrders = ordersLast60Days.filter(
    (o) => o.createdAt >= periodStart,
  );
  const previousPeriodOrders = ordersLast60Days.filter(
    (o) => o.createdAt < periodStart,
  );

  const currentRevenue = currentPeriodOrders.reduce(
    (sum, o) => sum + o.totalPrice,
    0,
  );
  const previousRevenue = previousPeriodOrders.reduce(
    (sum, o) => sum + o.totalPrice,
    0,
  );
  const revenueDelta =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : null;

  // Bygg dagliga staplar för de senaste 30 dagarna
  const revenueByDay = new Map<string, number>();
  for (const order of currentPeriodOrders) {
    const key = dayKey(order.createdAt);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.totalPrice);
  }
  const chartData = Array.from({ length: DAYS }, (_, i) => {
    const date = startOfDay(new Date(periodStart.getTime() + i * 86400000));
    const key = dayKey(date);
    return {
      date: key,
      label: date.toLocaleDateString("sv-SE", {
        day: "numeric",
        month: "short",
      }),
      revenue: Math.round((revenueByDay.get(key) ?? 0) * 100) / 100,
    };
  });

  const pendingOrders = allOrders.filter(
    (o) => !o.handled && !o.shipped,
  ).length;
  const invoicedOrders = allOrders.filter((o) => o.invoiceSent).length;

  // Populäraste produkterna, sorterat på totalt sålt antal
  const countMap: Record<string, { title: string; quantity: number }> = {};
  for (const order of allOrderItems) {
    const items = order.items as CartItem[];
    for (const item of items) {
      if (!item.productId) continue;
      if (!countMap[item.productId]) {
        countMap[item.productId] = { title: item.title, quantity: 0 };
      }
      countMap[item.productId].quantity += item.quantity ?? 1;
    }
  }
  const topProducts = Object.values(countMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    currentRevenue,
    revenueDelta,
    currentPeriodOrderCount: currentPeriodOrders.length,
    pendingOrders,
    invoicedOrders,
    customerCount,
    productCount,
    chartData,
    recentOrders,
    topProducts,
  };
}

function getOrderStatusLabel(order: {
  handled: boolean;
  shipped: boolean;
  invoiceSent: boolean;
}) {
  if (order.invoiceSent)
    return {
      text: "Faktura skickad",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
  if (order.shipped)
    return {
      text: "Skickad",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
  if (order.handled)
    return {
      text: "Hanteras",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    };
  return {
    text: "Ohanterad",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
}

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/logga-in");
  }

  const userRole = (session.user as { role?: string }).role ?? "user";
  const isAdmin = userRole === "admin";

  if (!(isAdmin || userRole === "editor")) {
    redirect("/");
  }

  const data = await getDashboardData();

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
          <p className="text-muted-foreground">
            Välkommen, {session.user.name || "Admin"} — här är läget just nu.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Försäljning (30 dagar)</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {data.currentRevenue.toLocaleString("sv-SE")} kr
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.revenueDelta === null ? (
                <p className="text-xs text-muted-foreground">
                  Ingen jämförelsedata för föregående period
                </p>
              ) : (
                <p
                  className={`text-xs font-medium ${
                    data.revenueDelta >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {data.revenueDelta >= 0 ? "+" : ""}
                  {data.revenueDelta.toFixed(1)}% jämfört med föregående 30
                  dagar
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Ordrar (30 dagar)</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {data.currentPeriodOrderCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {data.invoicedOrders} fakturerade totalt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Obehandlade ordrar</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {data.pendingOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin/offerter"
                className="text-xs text-primary hover:underline"
              >
                Visa offerter
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Besökare</CardDescription>
              <CardTitle className="text-2xl text-muted-foreground">
                –
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Ingen besöksstatistik är kopplad till sajten ännu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Försäljning senaste 30 dagarna</CardTitle>
            <CardDescription>Summa order per dag (kr)</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={data.chartData} />
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Senaste ordrar */}
          <Card>
            <CardHeader>
              <CardTitle>Senaste ordrar</CardTitle>
              <CardDescription>De 5 senaste offerterna</CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Inga ordrar ännu
                </p>
              ) : (
                <div className="space-y-3">
                  {data.recentOrders.map((order) => {
                    const status = getOrderStatusLabel(order);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.orderNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                          >
                            {status.text}
                          </span>
                          <span className="text-sm font-medium tabular-nums">
                            {order.totalPrice.toLocaleString("sv-SE")} kr
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link
                href="/admin/offerter"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Visa alla offerter →
              </Link>
            </CardContent>
          </Card>

          {/* Populäraste produkterna */}
          <Card>
            <CardHeader>
              <CardTitle>Populäraste produkterna</CardTitle>
              <CardDescription>Flest sålda enheter totalt</CardDescription>
            </CardHeader>
            <CardContent>
              {data.topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ingen försäljningsdata ännu
                </p>
              ) : (
                <div className="space-y-3">
                  {data.topProducts.map((product, i) => (
                    <div
                      key={product.title + i}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm text-muted-foreground w-4 shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium truncate">
                          {product.title}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground shrink-0 tabular-nums">
                        {product.quantity} st
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Snabblänkar */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Produkter</h3>
            <a
              href="/admin/produkter"
              className="text-sm text-muted-foreground hover:underline"
            >
              <p className="text-sm text-muted-foreground">
                Lägg till och redigera produkter ({data.productCount} st)
              </p>
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Kategorier</h3>
            <a
              href="/admin/kategorier"
              className="text-sm text-muted-foreground hover:underline"
            >
              <p className="text-sm text-muted-foreground">
                Lägg till eller ta bort kategorier
              </p>
            </a>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Offerter</h3>
            <a
              href="/admin/offerter"
              className="text-sm text-muted-foreground hover:underline"
            >
              <p className="text-sm text-muted-foreground">
                Visa och hantera offerter
              </p>
            </a>
          </div>

          {isAdmin && (
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Kunder</h3>
              <a
                href="/admin/kunder"
                className="text-sm text-muted-foreground hover:underline"
              >
                <p className="text-sm text-muted-foreground">
                  Hantera kunder här ({data.customerCount} st)
                </p>
              </a>
            </div>
          )}

          {isAdmin && (
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Admins</h3>
              <a
                href="/admin/admins"
                className="text-sm text-muted-foreground hover:underline"
              >
                <p className="text-sm text-muted-foreground">
                  Hantera adminanvändare
                </p>
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
