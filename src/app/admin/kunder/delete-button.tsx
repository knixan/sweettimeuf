"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteUser } from "./actions";

export default function DeleteUserButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Är du säker på att du vill ta bort kunden "${name}"? All kunddata raderas.`)) return;
        startTransition(async () => {
          const result = await deleteUser(id);
          if (result?.ok) {
            toast.success("Kunden togs bort");
            router.refresh();
          } else {
            toast.error("Kunde inte ta bort kunden");
          }
        });
      }}
    >
      {isPending ? "Tar bort..." : "Ta bort"}
    </Button>
  );
}
