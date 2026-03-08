import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FeatureTourStore {
  isRunning: boolean;
  hasCompleted: boolean;
  startTour: () => void;
  stopTour: () => void;
  completeTour: () => void;
}

export const useFeatureTourStore = create<FeatureTourStore>()(
  persist(
    (set) => ({
      isRunning: false,
      hasCompleted: false,
      startTour: () => set({ isRunning: true }),
      stopTour: () => set({ isRunning: false }),
      completeTour: () => set({ isRunning: false, hasCompleted: true }),
    }),
    {
      name: "feature-tour-store",
      storage: createJSONStorage(() => localStorage),
    }
  ),
);