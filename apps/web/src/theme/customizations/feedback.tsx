import { Theme, alpha, Components } from "@mui/material/styles";
import { gray } from "../themePrimitives";

export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        fontWeight: 600,
        color: theme.palette.common.white,
        alignItems: "center",
        border: "1px solid",
        boxShadow:
          "0 18px 40px rgba(0, 0, 0, 0.18), 0 6px 16px rgba(0, 0, 0, 0.12)",
        "& .MuiAlert-icon": { color: "inherit" },
        "& .MuiAlert-action": {
          color: "inherit",
          opacity: 0.86,
        },
      }),
    },
    variants: [
      // info
      {
        props: { variant: "standard", severity: "info" },
        style: ({ theme }) => ({
          backgroundColor: "hsl(193, 48%, 24%)",
          borderColor: alpha(theme.palette.info.light, 0.24),
          "& .MuiAlert-icon": { color: "hsl(187, 82%, 72%)" },
          ...theme.applyStyles("dark", {
            backgroundColor: "hsl(193, 48%, 18%)",
          }),
        }),
      },
      // success
      {
        props: { variant: "standard", severity: "success" },
        style: ({ theme }) => ({
          backgroundColor: "hsl(158, 42%, 24%)",
          borderColor: alpha(theme.palette.success.light, 0.28),
          "& .MuiAlert-icon": { color: "hsl(147, 72%, 72%)" },
          ...theme.applyStyles("dark", {
            backgroundColor: "hsl(158, 42%, 18%)",
          }),
        }),
      },
      // error
      {
        props: { variant: "standard", severity: "error" },
        style: ({ theme }) => ({
          backgroundColor: "hsl(358, 50%, 24%)",
          borderColor: alpha(theme.palette.error.light, 0.26),
          "& .MuiAlert-icon": { color: "hsl(0, 88%, 78%)" },
          ...theme.applyStyles("dark", {
            backgroundColor: "hsl(358, 50%, 18%)",
          }),
        }),
      },
      // warning
      {
        props: { variant: "standard", severity: "warning" },
        style: ({ theme }) => ({
          backgroundColor: "hsl(38, 56%, 24%)",
          borderColor: alpha(theme.palette.warning.light, 0.28),
          "& .MuiAlert-icon": { color: "hsl(43, 94%, 72%)" },
          ...theme.applyStyles("dark", {
            backgroundColor: "hsl(38, 56%, 18%)",
          }),
        }),
      },
    ],
  },
  MuiSnackbar: {
    styleOverrides: {
      root: {
        // Snackbar 容器樣式
        "& .MuiPaper-root": {
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
        },
      },
    },
    defaultProps: {
      // 預設設定
      // autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          border: "1px solid",
          borderColor: (theme.vars || theme).palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles("dark", {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
};
