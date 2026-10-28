"use client";
import { Suspense } from "react";
import AppAppBar from "@/app/[lng]/_components/AppAppBar";
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";
import { useFeatureTourStore } from "@/store/useFeatureTourStore";
import dynamic from "next/dynamic";
import type { Locale } from "@/i18n/types";
import type { AppBarLabels } from "./AppAppBar/types";

const JoyRide = dynamic(() => import("./JoyRide"), {
  ssr: false,
});

const AppSnackbar = dynamic(() => import("@/components/UI/AppSnackbar"));

export default function AppWrapper({
  appBarLabels,
  children,
  lng,
}: {
  appBarLabels: AppBarLabels;
  children: React.ReactNode;
  lng: Locale;
}) {
  const open = useAppSnackbarStore((state) => state.open);
  const message = useAppSnackbarStore((state) => state.message);
  const severity = useAppSnackbarStore((state) => state.severity);
  const onClose = useAppSnackbarStore((state) => state.onClose);
  const hasCompletedTour = useFeatureTourStore((state) => state.hasCompleted);
  const hasHydratedTour = useFeatureTourStore((state) => state.hasHydrated);

  return (
    <>
      {/* AppBar 使用 usePathname，動態路由需要 Suspense；它是 fixed 定位，
          fallback 為 null 也不會推動版面，頁面內容則留在靜態 shell 避免 CLS */}
      <Suspense fallback={null}>
        <AppAppBar labels={appBarLabels} lng={lng} />
      </Suspense>
      {hasHydratedTour && !hasCompletedTour ? <JoyRide /> : null}
      {open ? (
        <AppSnackbar
          open
          message={message}
          severity={severity}
          onClose={onClose}
        />
      ) : null}
      {children}
    </>
  );
}
