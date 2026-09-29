// src/lib/auth/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateSanityUser, getSanityUserByEmail } from "./sanity-user";
import {
  restoreAuthSessionUserImage,
  type AuthSessionUser,
} from "./session-user";

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
      } else if (token.user) {
        token.user = await restoreAuthSessionUserImage(
          token.user as AuthSessionUser,
          token.picture,
          async (email) => (await getSanityUserByEmail(email))?.image,
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const tokenUser = token.user as AuthSessionUser;
        session.user = {
          ...tokenUser,
          image: tokenUser.image || token.picture || session.user?.image,
        };
      }
      return session;
    },
  },
};
