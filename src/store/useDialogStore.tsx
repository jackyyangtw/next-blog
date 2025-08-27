// src/store/useDialogStore.tsx
import { create } from "zustand";
import { withDevtools } from "./withDevtools";

type DialogKey = "imageDialog" | "codeDialog";

const initialState: Record<DialogKey, boolean> = {
  imageDialog: false,
  codeDialog: false,
};

type DialogState = Record<DialogKey, boolean> & {
  openDialog: (key: DialogKey) => void;
  closeDialog: (key: DialogKey) => void;
  reset: () => void;
};

export const useDialogStore = create<DialogState>()(
  withDevtools(
    (set) => ({
      ...initialState,
      openDialog: (key) => set({ [key]: true }),
      closeDialog: (key) => set({ [key]: false }),
      reset: () => set(initialState, false),
    }),
    "DialogStore"
  )
);
