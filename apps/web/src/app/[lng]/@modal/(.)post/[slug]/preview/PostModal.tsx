"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { Close as CloseIcon } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

interface PostModalProps {
  children: ReactNode;
}

export default function PostModal({ children }: PostModalProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      aria-labelledby="post-modal-title"
      slotProps={{
        backdrop: {
          sx: (theme) => ({
            backgroundColor: "rgba(15, 23, 42, 0.34)",
            backdropFilter: "blur(10px)",
            ...theme.applyStyles("dark", {
              backgroundColor: "rgba(0, 0, 0, 0.78)",
            }),
          }),
        },
        paper: {
          sx: (theme) => ({
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.grey[900], 0.1)}`,
            backgroundColor: "hsl(220, 35%, 98%)",
            backgroundImage: [
              `radial-gradient(circle at 18% 0%, ${alpha(theme.palette.primary.light, 0.26)} 0%, transparent 34%)`,
              `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.92)} 0%, ${alpha(theme.palette.grey[100], 0.9)} 100%)`,
            ].join(", "),
            boxShadow:
              "0 28px 80px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255,255,255,0.74)",
            ...theme.applyStyles("dark", {
              borderColor: alpha(theme.palette.primary.light, 0.16),
              backgroundColor: "hsl(222, 28%, 8%)",
              backgroundImage: [
                `radial-gradient(circle at 18% 0%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 32%)`,
                `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.045)} 0%, transparent 26%)`,
              ].join(", "),
              boxShadow:
                "0 28px 80px rgba(0, 0, 0, 0.58), 0 0 0 1px rgba(255,255,255,0.035)",
            }),
          }),
        },
      }}
    >
      <DialogContent
        data-testid="post-preview-shell"
        sx={(theme) => ({
          p: { xs: 2.5, md: 4 },
          color: "text.primary",
          position: "relative",
          "& .post-modal-closeButton": {
            color: alpha(theme.palette.grey[900], 0.74),
            borderColor: alpha(theme.palette.grey[900], 0.12),
            backgroundColor: alpha(theme.palette.common.white, 0.72),
            backdropFilter: "blur(8px)",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.09),
              borderColor: alpha(theme.palette.primary.main, 0.22),
            },
            "&:active": {
              backgroundColor: alpha(theme.palette.primary.main, 0.13),
            },
            ...theme.applyStyles("dark", {
              color: alpha(theme.palette.common.white, 0.88),
              borderColor: alpha(theme.palette.common.white, 0.1),
              backgroundColor: alpha(theme.palette.common.white, 0.055),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.light, 0.13),
                borderColor: alpha(theme.palette.primary.light, 0.24),
              },
              "&:active": {
                backgroundColor: alpha(theme.palette.primary.light, 0.18),
              },
            }),
          },
          "& .MuiTypography-h3": {
            color: theme.palette.grey[900],
            letterSpacing: 0,
            ...theme.applyStyles("dark", {
              color: alpha(theme.palette.common.white, 0.96),
            }),
          },
          "& .MuiTypography-subtitle1": {
            color: theme.palette.grey[600],
            ...theme.applyStyles("dark", {
              color: alpha(theme.palette.common.white, 0.62),
            }),
          },
          "& .MuiTypography-body2": {
            color: theme.palette.grey[600],
            ...theme.applyStyles("dark", {
              color: alpha(theme.palette.common.white, 0.64),
            }),
          },
        })}
      >
        <IconButton
          className="post-modal-closeButton"
          aria-label="close post modal"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: { xs: 20, md: 32 },
            top: { xs: 20, md: 32 },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </DialogContent>
    </Dialog>
  );
}
