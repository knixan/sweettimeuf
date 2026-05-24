import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
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
      void sendEmail({
        to: user.email,
        subject: "Verifiera din e-postadress – SweetTime UF",
        html: `
          <h2>Välkommen till SweetTime UF!</h2>
          <p>Hej ${user.name ?? ""},</p>
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
      },
    },
  },
});
