"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

interface PostModalProps {
  children: React.ReactNode;
}

export default function PostModal({ children }: PostModalProps) {
  const router = useRouter();
  const params = useParams() as { lng?: string; slug?: string };

  const postPath = `/${params.lng ?? "en"}/post/${params.slug ?? ""}`;

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/${params.lng ?? "en"}/post`);
  };

  const handleOpenPostPage = () => {
    window.location.assign(postPath);
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
        sx={(theme) => ({
          p: { xs: 2.5, md: 4 },
          color: "text.primary",
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Box
            component="button"
            type="button"
            onClick={handleOpenPostPage}
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.75,
              py: 0.85,
              fontSize: "0.875rem",
              fontWeight: 600,
              color: theme.palette.grey[700],
              backgroundColor: alpha(theme.palette.common.white, 0.68),
              border: `1px solid ${alpha(theme.palette.grey[900], 0.12)}`,
              borderRadius: 1.5,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: (theme) =>
                theme.transitions.create(
                  ["background-color", "border-color", "color", "box-shadow"],
                  { duration: theme.transitions.duration.shorter },
                ),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.grey[900],
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.28)}`,
              },
              ...theme.applyStyles("dark", {
                color: alpha(theme.palette.common.white, 0.72),
                backgroundColor: alpha(theme.palette.common.white, 0.035),
                borderColor: alpha(theme.palette.common.white, 0.12),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.light, 0.1),
                  color: alpha(theme.palette.common.white, 0.92),
                  borderColor: alpha(theme.palette.primary.light, 0.28),
                },
              }),
            })}
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            <span>開啟完整文章</span>
          </Box>
          <IconButton
            className="post-modal-closeButton"
            aria-label="close post modal"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </DialogContent>
    </Dialog>
  );
}
