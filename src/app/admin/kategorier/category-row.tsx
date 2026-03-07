"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditCategoryForm from "./edit-form";
import DeleteButton from "./delete-button";

interface CategoryRowProps {
  category: { id: string; name: string; slug: string | null; showInNavbar: boolean };
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
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  category.showInNavbar
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {category.showInNavbar ? "Visas i navbar" : "Dold från navbar"}
                </span>
                {category.slug && (
                  <span className="text-xs text-muted-foreground font-mono">
                    /kategori/{category.slug}
                  </span>
                )}
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
