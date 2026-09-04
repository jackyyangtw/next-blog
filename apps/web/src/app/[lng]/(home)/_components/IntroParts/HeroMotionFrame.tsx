"use client";

import { ReactNode } from "react";
import { Box, keyframes } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

const floatIn = keyframes`
  from {
    opacity: 0;
    filter: blur(10px);
    transform: translate3d(0, 18px, 0) scale(0.985);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

interface HeroMotionFrameProps {
  children: ReactNode;
  delay?: number;
  sx?: SxProps<Theme>;
}

export default function HeroMotionFrame({
  children,
  delay = 0,
  sx,
}: HeroMotionFrameProps) {
  return (
    <Box
      sx={[
        {
          opacity: 0,
          transform: "translate3d(0, 18px, 0) scale(0.985)",
          transformOrigin: "50% 58%",
          animation: `${floatIn} 820ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
          animationDelay: `${delay}ms`,
          willChange: "opacity, transform, filter",
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            filter: "none",
            opacity: 1,
            transform: "none",
            willChange: "auto",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
