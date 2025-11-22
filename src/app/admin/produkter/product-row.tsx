"use client";

import { useState } from "react";
import { EditProductForm } from "./edit-form";
import { DeleteProductButton } from "./delete-button";

type Product = {
  id: string;
  title: string;
  articleNumber: string | null;
  summary: string | null;
  category: { name: string } | null;
  images: string[];
};

export function ProductRow({ product }: { product: Product }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-4">
        <EditProductForm
          productId={product.id}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 flex items-center justify-between hover:bg-accent/50">
      <div className="flex-1">
        <div className="font-semibold">{product.title}</div>
        {product.articleNumber && (
          <div className="text-sm text-muted-foreground">Art. nr: {product.articleNumber}</div>
        )}
        {product.category && (
          <div className="text-sm text-muted-foreground">Kategori: {product.category.name}</div>
        )}
        {product.summary && (
          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.summary}
          </div>
        )}
        <div className="text-sm text-muted-foreground">{product.images.length} bilder</div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-sm border border-input rounded hover:bg-accent"
        >
          Redigera
        </button>
        <DeleteProductButton id={product.id} />
      </div>
    </div>
  );
}
