"use client";
import AppAppBar from "@/components/UI/AppAppBar/AppAppBar";
import AppSnackbar from "@/components/UI/AppSnackbar";
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { open, message, severity, onClose } = useAppSnackbarStore();
  return (
    <>
      <AppAppBar />
      <AppSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={onClose}
      />
      {children}
    </>
  );
}
