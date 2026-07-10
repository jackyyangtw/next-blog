import type { CSSProperties } from "react";
import Image from "next/image";
import { Box, Stack, Typography } from "@mui/material";
import { PRINCIPLE_CODE } from "./HeroSection.constants";

const avatarImageStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export default function HeroProfileCard() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 2,
        position: "relative",
        overflow: "hidden",
        transition:
          "border-color 260ms ease, box-shadow 260ms ease, transform 260ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.58), transparent)",
          opacity: 0.56,
          pointerEvents: "none",
        },
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 4,
          transform: "translateY(-3px)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            transform: "none",
          },
        },
      }}
    >
      <Stack spacing={{ xs: 2, sm: 3 }} sx={{ position: "relative" }}>
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "error.main",
            }}
          />
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "warning.main",
            }}
          />
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "success.main",
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: { xs: 72, sm: 96 },
              height: { xs: 72, sm: 96 },
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 2,
            }}
          >
            <Image
              src="/images/avatar.png"
              alt="Jacky"
              width={96}
              height={96}
              loading="eager"
              fetchPriority="high"
              style={avatarImageStyle}
            />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                letterSpacing: 0,
              }}
            >
              Frontend Engineer
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                fontWeight: 700,
              }}
            >
              Jacky
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: "primary.dark",
            lineHeight: 1.8,
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
            ".dark &": {
              color: "primary.light",
            },
          }}
        >
          {PRINCIPLE_CODE}
        </Typography>
      </Stack>
    </Box>
  );
}
