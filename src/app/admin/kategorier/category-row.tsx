"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditCategoryForm from "./edit-form";
import DeleteButton from "./delete-button";

interface CategoryRowProps {
  category: { id: string; name: string; showInNavbar: boolean };
}

export default function CategoryRow({ category }: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className={`p-4 rounded-lg border ${isEditing ? "bg-muted/50" : "flex items-center justify-between hover:bg-muted/50"}`}>
      {isEditing ? (
        <EditCategoryForm category={category} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold">{category.name}</div>
              <div className="text-sm text-muted-foreground">
                {category.showInNavbar ? "Visas i navbar" : "Dold från navbar"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Redigera
            </Button>
            <DeleteButton id={category.id} />
          </div>
        </>
      )}
    </li>
  );
}
