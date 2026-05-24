"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Nytt lösenord måste vara minst 6 tecken");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Lösenorden matchar inte");
      return;
    }

    setLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Kunde inte byta lösenord");
    } else {
      toast.success("Lösenordet har bytts!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="bg-card rounded-lg border p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Byt lösenord</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div className="space-y-1">
          <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="newPassword">Nytt lösenord</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Sparar..." : "Byt lösenord"}
        </Button>
      </form>
    </div>
  );
}
