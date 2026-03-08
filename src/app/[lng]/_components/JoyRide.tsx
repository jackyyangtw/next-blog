"use client";
import { useFeatureTourStore } from "@/store/useFeatureTourStore";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CallBackProps, EVENTS, STATUS, Step } from "react-joyride";
import Joyride from "react-joyride";
import { useSession } from "next-auth/react";
import { usePathname ,useParams} from "next/navigation";

export default function JoyRide() {
  const { isRunning, completeTour, stopTour, hasCompleted, startTour } =
    useFeatureTourStore();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();
  const { slug } = useParams();

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
    if (!hasFavoriteTarget) {
      return [authStep, guideStep];
    }
    return [
      authStep,
      {
        target: '[data-tour="favorite-button"]',
        content: "這就是收藏按鈕，點擊即可加入或移除收藏。",
      },
      guideStep,
    ];
  }, [hasFavoriteTarget, isAuthenticated]);

  useEffect(() => {
    const isPostDetailPage = pathname.includes("/post/") && slug;
    // console.log('isPostDetailPage', Boolean(isPostDetailPage));
    setHasFavoriteTarget(Boolean(isPostDetailPage));
  }, [pathname, slug]);

  useEffect(() => {
    if (status === "loading" || hasCompleted || isRunning) return;
    startTour();
  }, [status, hasCompleted, isRunning, startTour]);

  return (
    <Joyride
      run={isRunning}
      continuous
      showSkipButton
      showProgress
      disableScrolling
      callback={handleTourCallback}
      steps={tutorialSteps}
      locale={{
        back: "上一步",
        close: "關閉",
        last: "完成",
        next: "下一步",
        skip: "略過",
      }}
      styles={{
        options: {
          zIndex: 1500,
        },
      }}
    />
  );
}
