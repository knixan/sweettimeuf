import { requireAdminOrEditor } from "@/lib/server-auth";
import { CreateProductForm } from "./form";
import { prisma } from "@/lib/prisma";

export default async function CreateProductPage() {
  await requireAdminOrEditor();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Skapa ny produkt</h1>
        <CreateProductForm categories={categories} />
      </div>
    </main>
  );
}
