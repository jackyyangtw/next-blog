import { Box, styled, keyframes } from "@mui/material";

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } 
`;

export const MarqueeContainer = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  userSelect: "none",
  display: "flex",
  padding: theme.spacing(4, 0),
  background: "transparent",
  position: "relative",
  "&:hover .marquee-content": {
    animationPlayState: "paused",
  },
}));

export const MarqueeContent = styled(Box)(() => ({
  display: "flex",
  whiteSpace: "nowrap",
  width: "fit-content",
  animation: `${scroll} 30s linear infinite`,
}));

export const TechItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: theme.spacing(10),

  filter: "grayscale(1)",
  opacity: 0.6,
  transition: "all 0.4s ease-in-out",
  cursor: "default",

  "&:hover": {
    filter: "grayscale(0) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
    opacity: 1,
    transform: "scale(1.1)",
  },
}));
