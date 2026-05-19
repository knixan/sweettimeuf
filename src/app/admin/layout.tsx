import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/logga-in");

  const userRole = (session.user as { role?: string }).role;
  if (userRole !== "admin") redirect("/");

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
