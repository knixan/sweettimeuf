import { requireAdminOrEditor } from "@/lib/server-auth";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminOrEditor();
  const isAdmin = (session.user.role ?? "user") === "admin";

  return (
    <div className="min-h-screen">
      <AdminNavbar isAdmin={isAdmin} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
