import type { ReactNode } from "react";

// Own the article children slot; the shared modal belongs to the locale layout.
export default function PostLayout({ children }: { children: ReactNode }) {
  return children;
}
