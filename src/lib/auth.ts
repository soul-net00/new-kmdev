import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { getAdminByEmail } from "@/models/Admin";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const admin = await getAdminByEmail(credentials.email);
        if (!admin) {
          return null;
        }

        const isValid = await bcryptjs.compare(credentials.password, admin.password);
        if (!isValid) {
          return null;
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({ profile, user, account }) {
      if (account?.provider === "github") {
        const allowedEmail = process.env.ADMIN_GITHUB_EMAIL;
        if (!allowedEmail) return true;
        const email = user.email || (profile as { email?: string } | undefined)?.email;
        return email === allowedEmail;
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string | null | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    }
  }
};