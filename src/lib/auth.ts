import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./email";
import { escapeHtml } from "./html";

export const auth = betterAuth({
  appName: "SweetTime UF",
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Skydd mot brute force / mejlspam. Egna, striktare regler för de känsliga
  // endpointerna. Lagras i minnet (nollställs vid omstart) – tillräckligt för
  // en enda long-running instans.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 900, max: 10 },
      "/sign-up/email": { window: 900, max: 10 },
      "/request-password-reset": { window: 900, max: 5 },
      "/forget-password": { window: 900, max: 5 },
      "/reset-password": { window: 900, max: 10 },
      "/send-verification-email": { window: 900, max: 5 },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Återställ ditt lösenord – SweetTime UF",
        html: `
          <h2>Återställ ditt lösenord</h2>
          <p>Klicka på länken nedan för att välja ett nytt lösenord:</p>
          <p><a href="${url}">${url}</a></p>
          <p>Länken är giltig i 1 timme. Om du inte begärde detta kan du ignorera detta e-post.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verifiera din e-postadress – SweetTime UF",
        html: `
          <h2>Välkommen till SweetTime UF!</h2>
          <p>Hej ${escapeHtml(user.name ?? "")},</p>
          <p>Klicka på länken nedan för att verifiera din e-postadress:</p>
          <p><a href="${url}">${url}</a></p>
          <p>Länken är giltig i 24 timmar.</p>
        `,
      });
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
    },
  },
});
