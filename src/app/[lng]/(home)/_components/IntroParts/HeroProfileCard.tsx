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
        p: { xs: 2.25, sm: 3 },
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 1,
        position: "relative",
        overflow: "hidden",
        transition:
          "border-color 260ms ease, box-shadow 260ms ease, transform 260ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          bgcolor: "divider",
          opacity: 0.7,
          pointerEvents: "none",
        },
        "&:hover": {
          borderColor: "text.secondary",
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            transform: "none",
          },
        },
      }}
    >
      <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ position: "relative" }}>
        <Stack direction="row" spacing={2.25} alignItems="center">
          <Box
            sx={{
              width: { xs: 68, sm: 82 },
              height: { xs: 68, sm: 82 },
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
            }}
          >
            <Image
              src="/images/avatar.png"
              alt="Jacky"
              width={82}
              height={82}
              loading="eager"
              fetchPriority="high"
              style={avatarImageStyle}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
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
                mt: 0.25,
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
                fontWeight: 700,
              }}
            >
              Jacky
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              fontSize: { xs: "0.72rem", sm: "0.8rem" },
              color: "text.secondary",
              lineHeight: 1.7,
              overflowWrap: "anywhere",
            }}
          >
            {PRINCIPLE_CODE}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
