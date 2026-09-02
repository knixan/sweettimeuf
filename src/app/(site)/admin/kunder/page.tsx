import { requireAdmin } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { CustomerList } from "./customer-list";

export default async function KunderPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    where: { role: "user" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kunder ({users.length})</h1>
      <CustomerList users={users} />
    </div>
  );
}
