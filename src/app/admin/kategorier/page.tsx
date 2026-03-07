import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";
import CreateCategoryForm from "./form";
import CategoryRow from "./category-row";

type CategoryRowType = { id: string; name: string; slug: string | null; showInNavbar: boolean };

export default async function AdminKategorierPage() {
  await requireAdminOrEditor();

  // Auto-generate slugs for any categories that are missing one
  try {
    const missing = await prisma.category.findMany({ where: { slug: null } });
    if (missing.length > 0) {
      const existing = await prisma.category.findMany({
        where: { slug: { not: null } },
        select: { slug: true },
      });
      const usedSlugs = existing.map((c) => c.slug as string);

      for (const cat of missing) {
        const base = generateSlug(cat.name);
        const slug = generateUniqueSlug(base, usedSlugs);
        usedSlugs.push(slug);
        await prisma.category.update({ where: { id: cat.id }, data: { slug } });
      }
    }
  } catch (err) {
    console.error("Could not fix missing slugs:", err);
  }

  let categories: CategoryRowType[] = [];
  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, showInNavbar: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Could not load categories:", error);
    categories = [];
  }

  return (
    <>
      <main className="flex grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Admin: Kategorier</h1>
          
          <div className="mb-8 p-6 bg-card rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Skapa ny kategori</h2>
            <CreateCategoryForm />
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Alla kategorier</h2>
            
            {categories.length === 0 ? (
              <p className="text-muted-foreground">
                Inga kategorier ännu. Skapa din första kategori ovan!
              </p>
            ) : (
              <ul className="space-y-2">
                {categories.map((c) => (
                  <CategoryRow key={c.id} category={{ id: c.id, name: c.name, slug: c.slug, showInNavbar: c.showInNavbar }} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
