import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    // DEMO ONLY - Remove this provider in production
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        if (
          credentials.username === "demo" &&
          credentials.password === "demo"
        ) {
          return {
            id: "demo-user-id",
            name: "Demo User",
            email: "brad@180vault.com",
          };
        }
        return null;
      },
    }),
  ],
  trustHost: true,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt", // Switch to database sessions after removing credentials provider
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub ?? ""; // Set user ID from token.sub or default to an empty string // Set user ID from token.sub
      }
      return session;
    },
    signIn: async ({ user }) => {
      if (!user.email) {
        return false;
      }
      if (
        user.email === "brad@180vault.com" ||
        user.email.endsWith("@vectorremote.com")
      ) {
        return true;
      }
      return "/auth/error?error=unauthorized";
    },
  },
} satisfies NextAuthConfig;
