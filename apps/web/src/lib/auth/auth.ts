// src/lib/auth/auth.ts
import type { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateSanityUser } from "./sanity-user";

type AuthSessionUser = User & {
  image?: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const { email, name, image } = user;
        const sanityUser = await getOrCreateSanityUser({
          email,
          name: name ?? undefined,
          image: image ?? undefined,
        });
        token.user = {
          id: sanityUser._id,
          _id: sanityUser._id,
          name: sanityUser.name,
          email: sanityUser.email,
          image: sanityUser.image || image,
          role: sanityUser.role,
        } satisfies AuthSessionUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const tokenUser = token.user as AuthSessionUser;
        session.user = {
          ...tokenUser,
          image: tokenUser.image || session.user?.image,
        };
      }
      return session;
    },
  },
};
