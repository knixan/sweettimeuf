import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeleteUserButton from "./delete-button";

export default async function KunderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");
  if ((session.user as { role?: string }).role !== "admin") redirect("/");

  const users = await prisma.user.findMany({
    where: { role: "user" },
    select: { id: true, name: true, email: true, emailVerified: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kunder ({users.length})</h1>

      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Namn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">E-post</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Verifierad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Skapad</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Inga kunder ännu
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm font-medium">{user.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.emailVerified ? (
                      <span className="text-green-600">✓ Ja</span>
                    ) : (
                      <span className="text-muted-foreground">Nej</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("sv-SE")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteUserButton id={user.id} name={user.name ?? user.email} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
