"use client";
import ReactQueryProvider from "./react-query";
import ReactCookieProvider from "./react-cookie";
import NextAuthProvider from "./next-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ReactCookieProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </ReactCookieProvider>
    </NextAuthProvider>
  );
}
