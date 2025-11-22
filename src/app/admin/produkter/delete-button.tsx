"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Är du säker på att du vill ta bort denna produkt?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Produkten togs bort");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Kunde inte ta bort produkt");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
    >
      {isPending ? "Tar bort..." : "Ta bort"}
    </button>
  );
}
