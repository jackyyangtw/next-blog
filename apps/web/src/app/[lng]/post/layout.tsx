import * as React from "react";

interface PostLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function PostLayout({ children, modal }: PostLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
