"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendContactMessage } from "@/app/om-oss/actions";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  message: z.string().min(10, "Skriv gärna lite mer om din förfrågan"),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

export function Contact() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    startTransition(async () => {
      try {
        await sendContactMessage(data);
        toast.success("Tack! Vi återkommer så snart vi kan.");
        reset();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ett fel uppstod, försök igen senare";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Namn *</label>
          <input
            {...register("name")}
            type="text"
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="Ditt namn"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Telefonnummer
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
            placeholder="070-123 45 67"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">E-post *</label>
        <input
          {...register("email")}
          type="email"
          className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          placeholder="din@email.se"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Meddelande *</label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          placeholder="Berätta vad du är intresserad av..."
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full rounded-full px-8 py-3"
      >
        {isPending ? "Skickar..." : "Skicka meddelande"}
      </Button>
    </form>
  );
}
