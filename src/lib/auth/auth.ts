// src/lib/auth/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateSanityUser } from "./sanity-user";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      // 只在登入時處理
      if (trigger === "signIn" && user && user.email) {
        const { email, name, image } = user;
        const sanityUser = await getOrCreateSanityUser({
          email,
          name: name ?? undefined,
          image: image ?? undefined,
        });
        token.user = {
          _id: sanityUser._id,
          name: sanityUser.name,
          email: sanityUser.email,
          image: sanityUser.image || image, // 這裡做 fallback
          role: sanityUser.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // 將 token.user 暴露到 session
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
};
