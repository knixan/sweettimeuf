"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { promoteToAdmin, removeAdmin } from "./actions";

type Admin = { id: string; name: string | null; email: string; createdAt: Date };

export function AdminList({ admins, currentUserId }: { admins: Admin[]; currentUserId: string }) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handlePromote(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    startTransition(async () => {
      const result = await promoteToAdmin(email.trim());
      if (result.ok) {
        toast.success("Användaren är nu admin");
        setEmail("");
        router.refresh();
      } else {
        toast.error(result.error ?? "Något gick fel");
      }
    });
  }

  function handleRemove(id: string, name: string) {
    if (id === currentUserId) {
      toast.error("Du kan inte ta bort din egen adminroll");
      return;
    }
    if (!confirm(`Ta bort adminroll från "${name}"?`)) return;
    startTransition(async () => {
      await removeAdmin(id);
      toast.success("Adminroll borttagen");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Add admin */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Lägg till admin</h2>
        <form onSubmit={handlePromote} className="flex gap-2">
          <Input
            type="email"
            placeholder="E-postadress till befintlig användare"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sparar..." : "Gör till admin"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Användaren måste redan ha ett konto på sidan.
        </p>
      </div>

      {/* Admin list */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Namn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">E-post</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Skapad</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 text-sm font-medium">{admin.name || "—"}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{admin.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(admin.createdAt).toLocaleDateString("sv-SE")}
                </td>
                <td className="px-6 py-4 text-right">
                  {admin.id !== currentUserId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRemove(admin.id, admin.name ?? admin.email)}
                    >
                      Ta bort admin
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Du</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
