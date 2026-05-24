"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

export default function GlomtLosenordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: "/aterstall-losenord",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Något gick fel");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Glömt lösenord?</CardTitle>
          <CardDescription>
            Ange din e-postadress så skickar vi en länk för att återställa lösenordet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Om ett konto med den e-postadressen finns skickas ett återställningsmail inom kort.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/logga-in">Tillbaka till inloggning</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">E-postadress</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.se"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Skickar..." : "Skicka återställningslänk"}
              </Button>
              <div className="text-center">
                <Button variant="link" asChild className="text-sm">
                  <Link href="/logga-in">Tillbaka till inloggning</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
