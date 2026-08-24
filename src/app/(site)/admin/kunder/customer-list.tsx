"use client";

import { useState } from "react";
import DeleteUserButton from "./delete-button";

type Customer = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
};

export function CustomerList({ users }: { users: Customer[] }) {
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const filtered = term
    ? users.filter(
        (u) =>
          (u.name?.toLowerCase().includes(term) ?? false) ||
          u.email.toLowerCase().includes(term),
      )
    : users;

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Sök på namn eller e-post..."
        className="w-full rounded-md bg-input/10 border border-input px-3 py-2 text-sm"
      />

      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Namn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                E-post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Verifierad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Skapad
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  {term ? "Inga kunder matchar sökningen" : "Inga kunder ännu"}
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm font-medium">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
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
                    <DeleteUserButton
                      id={user.id}
                      name={user.name ?? user.email}
                    />
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
