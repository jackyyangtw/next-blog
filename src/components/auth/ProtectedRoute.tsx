"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const { showSnackbar } = useAppSnackbarStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      showSnackbar({ message: "請先登入", severity: "warning" });
      router.push("/auth");
    }
  }, [status, router, showSnackbar]);

  if (status === "loading") return null; // 或 loading spinner

  return <>{children}</>;
}