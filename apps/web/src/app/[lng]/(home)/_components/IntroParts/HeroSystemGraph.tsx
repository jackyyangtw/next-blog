"use client";

import { Box, Typography, keyframes } from "@mui/material";
import Image from "next/image";
const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.08); }
`;

const NODES = [
  { label: "Next.js", top: "12%", left: "16%", color: "#60a5fa" },
  { label: "Sanity", top: "65%", left: "8%", color: "#f97316" },
  { label: "AI systems", top: "20%", right: "7%", color: "#a78bfa" },
  { label: "Automation", bottom: "9%", right: "13%", color: "#2dd4bf" },
] as const;

export default function HeroSystemGraph() {
  return (
    <Box
      aria-label="Jacky Dev development systems: Next.js, Sanity, AI systems, and automation"
      role="img"
      sx={{
        aspectRatio: "1 / 0.88",
        minHeight: { xs: 300, md: 360 },
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        backgroundImage: (theme) =>
          `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}20 0%, transparent 35%), radial-gradient(circle at 78% 20%, ${theme.palette.secondary.main}18 0%, transparent 26%)`,
        "&::before": {
          content: '\"\"',
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.14) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 76%)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "70%",
          aspectRatio: "1",
          top: "50%",
          left: "50%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          animation: `${orbit} 36s linear infinite`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "13%",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "50%",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: 120, sm: 145 },
          height: { xs: 120, sm: 145 },
          overflow: "hidden",
          border: "3px solid",
          borderColor: "background.paper",
          borderRadius: "50%",
          boxShadow: (theme) =>
            `0 0 0 10px ${theme.palette.primary.main}14, 0 0 48px ${theme.palette.primary.main}70`,
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      >
        <Image
          src="/images/avatar.png"
          alt="Jacky"
          fill
          priority
          sizes="(max-width: 600px) 120px, 145px"
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Typography
        sx={{
          position: "absolute",
          top: "calc(50% + 88px)",
          left: "50%",
          px: 1,
          py: 0.25,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          color: "text.primary",
          fontSize: "0.625rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}
      >
        JACKY DEV
      </Typography>

      {NODES.map((node, index) => (
        <Box
          key={node.label}
          sx={{
            position: "absolute",
            top: "top" in node ? node.top : undefined,
            right: "right" in node ? node.right : undefined,
            bottom: "bottom" in node ? node.bottom : undefined,
            left: "left" in node ? node.left : undefined,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.15,
            py: 0.7,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 99,
            bgcolor: "background.paper",
            boxShadow: 1,
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: node.color,
              animation: `${pulse} ${2.4 + index * 0.35}s ease-in-out infinite`,
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.72rem" },
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {node.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
