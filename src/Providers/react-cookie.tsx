"use client";
import { CookiesProvider } from "react-cookie";

export default function ReactCookieProvider({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      {children}
    </CookiesProvider>
  );
}
