"use client";
import { useCurrentMode } from "@/hooks/MUI/useCurrentMode";
import { MarqueeContainer, MarqueeContent, TechItem } from "./styles";
import { Typography, Box, Stack } from "@mui/material";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiReactquery,
  SiMui,
  SiTailwindcss,
  SiGitlab,
  SiShadcnui,
  SiVitest,
} from "react-icons/si";

export default function TechMarquee() {
  const currentMode = useCurrentMode();

  const TECH_STACK = [
    { name: "React", icon: <SiReact color="#61DAFB" /> },
    {
      name: "Next.js",
      icon: (
        <SiNextdotjs color={currentMode === "dark" ? "#FFFFFF" : "#000000"} />
      ),
    },
    { name: "TypeScript", icon: <SiTypescript color="#3178C6" /> },
    { name: "Zustand", icon: null },
    { name: "React Query", icon: <SiReactquery color="#FF4154" /> },
    { name: "MUI", icon: <SiMui color="#007FFF" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss color="#06B6D4" /> },
    {
      name: "shadcn/ui",
      icon: (
        <SiShadcnui color={currentMode === "dark" ? "#FFFFFF" : "#000000"} />
      ),
    },
    { name: "Testing", icon: <SiVitest color="#6E9F18" /> },
    { name: "Security", icon: null },
    { name: "GitLab", icon: <SiGitlab color="#FC6D26" /> },
  ];

  const displayStack = [...TECH_STACK, ...TECH_STACK];

  return (
    <MarqueeContainer>
      <MarqueeContent className="marquee-content">
        {displayStack.map((tech, index) => (
          <TechItem key={`${tech.name}-${index}`}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ fontSize: "2.5rem", display: "flex" }}>
                {tech.icon}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.1rem",
                  fontFamily: "monospace",
                  color: "inherit",
                }}
              >
                {tech.name}
              </Typography>
            </Stack>
          </TechItem>
        ))}
      </MarqueeContent>
    </MarqueeContainer>
  );
}
