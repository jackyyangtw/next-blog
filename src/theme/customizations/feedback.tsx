import { Theme, alpha, Components } from "@mui/material/styles";
import { gray } from "../themePrimitives";

export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        fontWeight: 500,
        color: theme.palette.primary.contrastText,
        alignItems: "center", 
        "& .MuiAlert-icon": { color: theme.palette.primary.contrastText },
      }),
    },
    variants: [
      // info
      {
        props: { variant: "standard", severity: "info" },
        style: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.info.main, 1),
          ...theme.applyStyles("dark", {
            backgroundColor: alpha(theme.palette.info.main, 0.3),
          }),
        }),
      },
      // success
      {
        props: { variant: "standard", severity: "success" },
        style: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.success.main, 1),
          ...theme.applyStyles("dark", {
            backgroundColor: alpha(theme.palette.success.main, 0.3),
          }),
        }),
      },
      // error
      {
        props: { variant: "standard", severity: "error" },
        style: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.error.main, 1),
          ...theme.applyStyles("dark", {
            backgroundColor: alpha(theme.palette.error.main, 0.3),
          }),
        }),
      },
      // warning
      {
        props: { variant: "standard", severity: "warning" },
        style: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.warning.main, 1),
          ...theme.applyStyles("dark", {
            backgroundColor: alpha(theme.palette.warning.main, 0.3),
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
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          // border: "1px solid",
          borderColor: (theme: Theme) => alpha(theme.palette.common.white, 0.1),
          backdropFilter: "blur(8px)",
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.background.paper, 0.95),
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
