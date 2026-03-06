"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateCategory } from "./actions";

const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  showInNavbar: z.boolean(),
});
type CategoryValues = z.infer<typeof CategorySchema>;

interface EditCategoryFormProps {
  category: { id: string; name: string; showInNavbar?: boolean };
  onClose?: () => void;
}

export default function EditCategoryForm({ category, onClose }: EditCategoryFormProps) {
  const router = useRouter();
  const form = useForm<CategoryValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      showInNavbar: category.showInNavbar ?? false,
    },
  });

  async function onSubmit(values: CategoryValues) {
    try {
      const res = await updateCategory(values);
      if (res.ok) {
        toast.success(`Kategori uppdaterad: ${res.name}`);
        router.refresh();
        onClose?.();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Kunde inte uppdatera kategori");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Namn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register("showInNavbar")} className="h-4 w-4" />
            <span>Visa i navigering</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button disabled={form.formState.isSubmitting || !form.formState.isValid}>
            {form.formState.isSubmitting ? "Sparar..." : "Spara ändringar"}
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
