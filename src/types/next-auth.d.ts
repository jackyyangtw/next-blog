// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    _id: string;
  }
  interface Session {
    user?: User;
  }
}
