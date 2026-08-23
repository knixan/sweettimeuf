import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/logga-in");

  const userRole = (session.user as { role?: string }).role ?? "user";
  if (!(userRole === "admin" || userRole === "editor")) redirect("/");

  return (
    <div className="min-h-screen">
      <AdminNavbar isAdmin={userRole === "admin"} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
