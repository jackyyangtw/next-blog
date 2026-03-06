"use client";
import { Box, alpha, useTheme } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useColorScheme } from "@mui/material/styles";

const baseOpacity = 0.15; // 稍微提高一點以應對雙層稀釋

export default function TrackingLight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { mode, systemMode } = useColorScheme();
  const theme = useTheme();

  const currentMode = mode === "system" ? systemMode : mode;

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (event: MouseEvent) => {
      frameId = requestAnimationFrame(() => {
        setMousePos({ x: event.clientX, y: event.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // 計算顏色與透明度
  const colors = useMemo(() => {
    const mainColor = theme.palette.primary.main;
    const alphaFactor = currentMode === "dark" ? 1 : 0.5;
    return {
      core: alpha(mainColor, baseOpacity * alphaFactor),
      outer: alpha(mainColor, (baseOpacity / 3) * alphaFactor),
    };
  }, [theme.palette.primary.main, currentMode]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
        // 關鍵：使用 mix-blend-mode 讓燈光與背景網格產生物理融合感
        mixBlendMode: currentMode === "dark" ? "screen" : "multiply",
        // 增加 transition 的秒數與 timing function，製造滑動時的優雅延遲感
        transition: "background 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        background: `
          radial-gradient(
            400px circle at ${mousePos.x}px ${mousePos.y}px, 
            ${colors.core} 0%, 
            transparent 60%
          ),
          radial-gradient(
            800px circle at ${mousePos.x}px ${mousePos.y}px, 
            ${colors.outer} 0%, 
            transparent 80%
          )
        `,
      }}
    />
  );
}
