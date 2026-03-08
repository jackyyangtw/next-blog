"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

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
    >
      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box
            component="button"
            type="button"
            onClick={handleOpenPostPage}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              fontSize: "0.85rem",
              color: "text.secondary",
              backgroundColor: "transparent",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              cursor: "pointer",
              transition: (theme) =>
                theme.transitions.create(
                  ["background-color", "border-color", "color", "box-shadow"],
                  { duration: theme.transitions.duration.shorter },
                ),
              "&:hover": {
                backgroundColor: "action.hover",
                color: "text.primary",
                borderColor: "text.secondary",
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: (theme) =>
                  `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`,
              },
            }}
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            <span>開啟完整文章</span>
          </Box>
          <IconButton aria-label="close post modal" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </DialogContent>
    </Dialog>
  );
}
