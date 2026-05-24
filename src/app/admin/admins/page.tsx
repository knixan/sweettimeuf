import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminList } from "./admin-list";

export default async function AdminsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");
  if ((session.user as { role?: string }).role !== "admin") redirect("/");

  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Adminhantering</h1>
      <AdminList admins={admins} currentUserId={session.user.id} />
    </div>
  );
}
