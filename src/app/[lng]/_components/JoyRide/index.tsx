"use client";
import { useEffect, useCallback, useMemo } from "react";

// ------------------ store ----------------
import { useFeatureTourStore } from "@/store/useFeatureTourStore";

// ------------------ react-joyride ----------------
import { EventData, EVENTS, Joyride, STATUS, Step } from "react-joyride";

// ------------------ next-auth ----------------
import { useSession } from "next-auth/react";

// ------------------ next-navigation ----------------
import { usePathname, useParams } from "next/navigation";

// ------------------ mui ----------------
import { useTheme } from "@mui/material";

// ------------------ components ----------------
import Tooltip from "./ToolTip";
import Animations, {
  FADE_IN_ANIMATION,
  FADE_IN_ANIMATION_DURATION,
} from "./Animations";

export default function JoyRide() {
  const isRunning = useFeatureTourStore((state) => state.isRunning);
  const completeTour = useFeatureTourStore((state) => state.completeTour);
  const stopTour = useFeatureTourStore((state) => state.stopTour);
  const hasCompleted = useFeatureTourStore((state) => state.hasCompleted);
  const startTour = useFeatureTourStore((state) => state.startTour);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const { slug } = useParams();
  const theme = useTheme();

  const handleTourCallback = useCallback(
    (data: EventData) => {
      const isTargetMissing = data.type === EVENTS.TARGET_NOT_FOUND;
      const isFinished = data.status === STATUS.FINISHED;
      const isSkipped = data.status === STATUS.SKIPPED;
      if (isTargetMissing || isFinished || isSkipped) {
        completeTour();
        return;
      }
      if (data.action === "close") {
        stopTour();
      }
    },
    [completeTour, stopTour],
  );

  const isPostDetailPage = pathname.includes("/post/") && !!slug;
  const hasFavoriteTarget = isPostDetailPage;
  const tutorialSteps = useMemo<Step[]>(() => {
    const authStep: Step = {
      target: '[data-tour="auth-entry"]',
      content: isAuthenticated
        ? "你已登入，可以從這裡前往個人頁查看收藏清單。"
        : "先從這裡登入，登入後才能使用收藏功能。",
      skipBeacon: true,
    };
    const guideStep: Step = {
      target: "body",
      placement: "center",
      content:
        "進入任一文章頁後，點右上角的書籤圖示即可加入收藏，之後可在個人頁查看。",
    };
    const toggleFavoriteStep: Step = {
      target: '[data-tour="favorite-button"]',
      content: "這就是收藏按鈕，點擊即可加入或移除收藏。",
    };
    if (!hasFavoriteTarget) {
      return [authStep, guideStep];
    }
    return [authStep, toggleFavoriteStep, guideStep];
  }, [hasFavoriteTarget, isAuthenticated]);

  useEffect(() => {
    if (status === "loading" || hasCompleted || isRunning) return;
    startTour();
  }, [status, hasCompleted, isRunning, startTour]);

  return (
    <>
      <Animations />
      <Joyride
        run={isRunning}
        continuous
        onEvent={handleTourCallback}
        steps={tutorialSteps}
        tooltipComponent={Tooltip}
        options={{
          zIndex: 1500,
          overlayColor: "rgba(0, 0, 0, 0.75)",
          primaryColor: theme.palette.primary.main,
          showProgress: true,
          skipScroll: true,
          buttons: ["back", "skip", "primary", "close"],
        }}
        styles={{
          overlay: {
            animation: `${FADE_IN_ANIMATION} ${FADE_IN_ANIMATION_DURATION}ms ease-out forwards`,
          },
        }}
      />
    </>
  );
}
