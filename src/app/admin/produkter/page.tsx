import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Link } from "lucide-react";


export default async function CreateArticlePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/logga-in");
  }

  const user = session.user as { role?: string; name?: string };

  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Skapa ny artikel</h1>
        
        <div className="bg-card p-6 rounded-lg border">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Titel
              </label>
              <input
                type="text"
                name="title"
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="Artikelns titel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Innehåll
              </label>
              <textarea
                name="content"
                rows={10}
                className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
                placeholder="Skriv artikelns innehåll här..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Publicera artikel
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-input rounded-md hover:bg-accent"
              >
                Spara som utkast
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
