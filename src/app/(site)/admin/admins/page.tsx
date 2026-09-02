import { requireAdmin } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { AdminList } from "./admin-list";

export default async function AdminsPage() {
  const session = await requireAdmin();

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
