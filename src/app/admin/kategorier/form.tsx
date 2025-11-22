"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
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
import { createCategory } from "./actions";

const CategorySchema = z.object({ name: z.string().min(1).max(50), showInNavbar: z.boolean().optional().default(false) });
type CategoryValues = z.infer<typeof CategorySchema>;

export default function CreateCategoryForm() {
  const router = useRouter();

  const rhfResolver = zodResolver(CategorySchema) as Resolver<CategoryValues>;

  const form = useForm<CategoryValues>({
    resolver: rhfResolver,
    defaultValues: { name: "", showInNavbar: false },
  });

  async function onSubmit(values: CategoryValues) {
    try {
      const res = await createCategory(values);
      if (res.ok) {
        toast.success(`Kategori skapad: ${res.name}`);
        form.reset();
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Kunde inte skapa kategori");
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

        <Button disabled={form.formState.isSubmitting || !form.formState.isValid}>
          {form.formState.isSubmitting ? "Läser..." : "Skapa kategori"}
        </Button>
      </form>
    </Form>
  );
}
