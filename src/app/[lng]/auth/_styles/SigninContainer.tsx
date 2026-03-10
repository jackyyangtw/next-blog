"use client";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { brand, gray } from "@/theme/themePrimitives";
import { alpha } from "@mui/material/styles";

export const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100dvh",
  width: "100%",
  position: "relative",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "fixed",
    zIndex: -1,
    inset: 0,
    // Light Mode: 使用極淡的藍色 brand[50] 往純白擴散
    backgroundImage: `radial-gradient(ellipse at 50% 50%, ${brand[50]} 0%, hsl(0, 0%, 100%) 80%)`,
    backgroundRepeat: "no-repeat",

    ...theme.applyStyles("dark", {
      // Dark Mode: 使用 brand[800] 的深藍色作為核心，往最深色 gray[900] 擴散
      // 加上 0.3 的透明度讓發光感更自然，不會太刺眼
      backgroundImage: `radial-gradient(at 50% 50%, ${alpha(brand[800], 0.3)} 0%, ${gray[900]} 80%)`,
    }),
  },
}));
