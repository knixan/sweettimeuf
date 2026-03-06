import { z } from "zod";

// --- Auth Schemas --- för zod validation för auth forms ---
// Denna fil är säker att importera i både client och server komponenter

// SignUp Schema
export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Namn måste vara minst 2 tecken")
      .max(50),
    email: z.string().email("Ogiltig e-postadress").max(100),
    password: z
      .string()
      .min(8, "Lösenordet måste vara minst 8 tecken")
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    error: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });
// Typ för SignUp input
export type SignUpInput = z.infer<typeof SignUpSchema>;

// SignIn Schema
export const SignInSchema = z.object({
  email: z.string().email("Ogiltig e-postadress").max(100),
  password: z
    .string()
    .min(8, "Lösenordet måste vara minst 8 tecken")
    .max(100),
});
// Typ för SignIn input
export type SignInInput = z.infer<typeof SignInSchema>;

// Password Reset Request Schema
export const PasswordResetRequestSchema = z.object({
  email: z.string().email("Ogiltig e-postadress").max(100),
});
// Typ för Password Reset Request input
export type PasswordResetRequestInput = z.infer<
  typeof PasswordResetRequestSchema
>;

// Password Reset Schema
export const PasswordResetSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8).max(100),
    confirmNewPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    error: "Lösenorden matchar inte",
    path: ["confirmNewPassword"],
  });
// Typ för Password Reset input
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
