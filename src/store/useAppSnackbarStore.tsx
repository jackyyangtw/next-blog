import { create } from "zustand";
import { withDevtools } from "./withDevtools";
import { AlertColor } from "@mui/material";

interface AppSnackbarStore {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  showSnackbar: ({ message, severity }: { message: string; severity: AlertColor }) => void;
}

export const useAppSnackbarStore = create<AppSnackbarStore>(
  withDevtools(
    (set) => ({
      open: false,
      message: "",
      severity: "success",
      onClose: () => set({ open: false }),
      showSnackbar: ({ message, severity }) =>
        set({ open: true, message, severity }),
    }),
    "AppSnackbarStore"
  )
);
