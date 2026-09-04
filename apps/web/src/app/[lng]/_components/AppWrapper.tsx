"use client";
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
      <AppAppBar labels={appBarLabels} lng={lng} />
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
