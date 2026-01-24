"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCategory } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Är du säker på att du vill ta bort kategorin?")) return;
        startTransition(async () => {
          try {
            const result = await deleteCategory(id);
            toast[result?.ok ? "success" : "error"](
              result?.ok ? "Kategorin togs bort" : "Kunde inte ta bort kategorin"
            );
            if (result?.ok) router.refresh();
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            toast.error(msg || "Något gick fel");
          }
        });
      }}
    >
      {isPending ? "Tar bort..." : "Ta bort"}
    </Button>
  );
}
