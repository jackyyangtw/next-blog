"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

// ------------------ store ----------------
import { useFeatureTourStore } from "@/store/useFeatureTourStore";

// ------------------ react-joyride ----------------
import { CallBackProps, EVENTS, STATUS, Step } from "react-joyride";
import Joyride from "react-joyride";

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
  const { isRunning, completeTour, stopTour, hasCompleted, startTour } =
    useFeatureTourStore();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const { slug } = useParams();
  const theme = useTheme();

  const handleTourCallback = useCallback(
    (data: CallBackProps) => {
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

  const [hasFavoriteTarget, setHasFavoriteTarget] = useState(false);
  const tutorialSteps = useMemo<Step[]>(() => {
    const authStep: Step = {
      target: '[data-tour="auth-entry"]',
      content: isAuthenticated
        ? "你已登入，可以從這裡前往個人頁查看收藏清單。"
        : "先從這裡登入，登入後才能使用收藏功能。",
      disableBeacon: true,
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
    const isPostDetailPage = pathname.includes("/post/") && slug;
    setHasFavoriteTarget(Boolean(isPostDetailPage));
  }, [pathname, slug]);

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
        showSkipButton
        showProgress
        disableScrolling
        callback={handleTourCallback}
        steps={tutorialSteps}
        tooltipComponent={Tooltip}
        styles={{
          options: {
            zIndex: 1500,
            overlayColor: "rgba(0, 0, 0, 0.75)",
            spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
            primaryColor: theme.palette.primary.main,
          },
          overlay: {
            animation: `${FADE_IN_ANIMATION} ${FADE_IN_ANIMATION_DURATION}ms ease-out forwards`,
          },
          spotlight: {
            borderRadius: 8,
          },
        }}
      />
    </>
  );
}
