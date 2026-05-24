"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import authClient from "@/lib/auth-client";
import { SignInSchema, type SignInInput } from "@/lib/schema/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInInput) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message || "Kunde inte logga in");
    } else {
      toast.success("Inloggad!");
      router.refresh();
      router.push("/");
    }
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Logga in</CardTitle>
        <CardDescription>Ange dina uppgifter för att logga in</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/registrera">Skapa konto</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Lösenord</FormLabel>
                    <Link
                      href="/glomt-losenord"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Glömt lösenord?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Laddar..." : "Logga in"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <Link
            href="/skicka-verifiering"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Fick inget verifieringsmail? Skicka igen
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
