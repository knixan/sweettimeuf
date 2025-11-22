import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import CreateCategoryForm from "./form";
import CategoryRow from "./category-row";

type CategoryRowType = { id: string; name: string; showInNavbar: boolean };

export default async function AdminKategorierPage() {
  await requireAdminOrEditor();

  let categories: CategoryRowType[] = [];
  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true, showInNavbar: true },
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
                  <CategoryRow key={c.id} category={c} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
