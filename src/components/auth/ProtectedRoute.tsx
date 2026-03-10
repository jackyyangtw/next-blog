"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";

// 用於前端路由守衛，確保用戶登入才能訪問某些頁面。
// 用於 page.tsx 非ＲＳＣ的情況
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