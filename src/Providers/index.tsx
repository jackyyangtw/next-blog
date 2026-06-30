"use client";
import NextAuthProvider from "./next-auth";
import ReactQueryProvider from "./react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </NextAuthProvider>
  );
}
