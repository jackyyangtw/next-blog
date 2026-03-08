"use client";
import AppAppBar from "@/app/[lng]/_components/AppAppBar";
import AppSnackbar from "@/components/UI/AppSnackbar";
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";
import dynamic from "next/dynamic";

const JoyRide = dynamic(() => import("./JoyRide"), {
  ssr: false,
});

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { open, message, severity, onClose } = useAppSnackbarStore();
  return (
    <>
      <AppAppBar />
      <JoyRide />
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
