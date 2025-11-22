"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCategory } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Är du säker på att du vill ta bort kategorin?")) return;

    startTransition(async () => {
      try {
        const result = await deleteCategory(id);

        if (result?.ok) {
          toast.success("Kategorin togs bort");
          router.refresh();
        } else {
          toast.error("Kunde inte ta bort kategorin");
        }
      } catch (err) {
        console.error(err);
        const msg = err instanceof Error ? err.message : String(err);
        toast.error(msg || "Något gick fel");
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Tar bort..." : "Ta bort"}
    </Button>
  );
}

export default DeleteButton;
