import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function AdminPage() {
const session = await auth.api.getSession({
headers: await headers(),
});

// Redirect if not logged in
if (!session?.user) {
redirect("/logga-in");
}

// Check if user is admin - cast to include role field
const userRole = (session.user as { role?: string }).role;

if (userRole !== "admin") {
redirect("/");
}

return (
<main className="min-h-screen p-6">
<div className="max-w-7xl mx-auto">
<h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

<div className="bg-card p-6 rounded-lg border mb-6">
<h2 className="text-xl font-semibold mb-4">Välkommen, {session.user.name || "Admin"}!</h2>
<p className="text-muted-foreground">
Du har administratörsrättigheter och kan hantera webbplatsen här.
</p>
</div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
<div className="bg-card p-6 rounded-lg border">
<h3 className="font-semibold mb-2">Kunder</h3>
<a href="/admin/kunder" className="text-sm text-muted-foreground hover:underline">
<p className="text-sm text-muted-foreground">Hantera kunder här</p>
</a>
</div>

<div className="bg-card p-6 rounded-lg border">
<h3 className="font-semibold mb-2">Kategorier</h3>
<a href="/admin/kategorier" className="text-sm text-muted-foreground hover:underline">
<p className="text-sm text-muted-foreground">Lägg till eller ta bort kategorier</p>
</a>
</div>

<div className="bg-card p-6 rounded-lg border">
<h3 className="font-semibold mb-2">Produkter</h3>
<a href="/admin/produkter" className="text-sm text-muted-foreground hover:underline">
<p className="text-sm text-muted-foreground">Lägg till och redigera produkter</p>
</a>
</div>

<div className="bg-card p-6 rounded-lg border">
<h3 className="font-semibold mb-2">Offerter</h3>
<a href="/admin/offerter" className="text-sm text-muted-foreground hover:underline">
<p className="text-sm text-muted-foreground">Visa och hantera offerter</p>
</a>
</div>
</div>
</div>
</main>
);
}
