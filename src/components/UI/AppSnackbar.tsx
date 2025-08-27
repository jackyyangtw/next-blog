// src/components/ui/AppSnackbar/AppSnackbar.tsx

/**
 * types
 * https://github.com/mui/material-ui/blob/v7.2.0/packages/mui-material/src/Alert/Alert.d.ts
 * DOCS
 * https://mui.com/material-ui/react-alert/
 */
"use client";
import Snackbar from "@mui/material/Snackbar";
import Alert, { type AlertColor } from "@mui/material/Alert";

interface Props {
  open: boolean;
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number | null;
  onClose: () => void;
}

export default function AppSnackbar({
  open,
  message,
  severity = "success",
  autoHideDuration,
  onClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
