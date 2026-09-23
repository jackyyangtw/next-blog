"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

interface PostModalOpenButtonProps {
  postPath: string;
}

export default function PostModalOpenButton({
  postPath,
}: PostModalOpenButtonProps) {
  const router = useRouter();

  const handleOpenPostPage = () => {
    router.push(postPath);
  };

  return (
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
        transition: theme.transitions.create(
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
  );
}
