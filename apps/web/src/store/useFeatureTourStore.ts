import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FeatureTourStore {
  isRunning: boolean;
  hasCompleted: boolean;
  hasHydrated: boolean;
  startTour: () => void;
  stopTour: () => void;
  completeTour: () => void;
  markHydrated: () => void;
}

export const useFeatureTourStore = create<FeatureTourStore>()(
  persist(
    (set) => ({
      isRunning: false,
      hasCompleted: false,
      hasHydrated: false,
      startTour: () => set({ isRunning: true }),
      stopTour: () => set({ isRunning: false }),
      completeTour: () => set({ isRunning: false, hasCompleted: true }),
      markHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "feature-tour-store",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ hasCompleted }) => ({ hasCompleted }),
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);
