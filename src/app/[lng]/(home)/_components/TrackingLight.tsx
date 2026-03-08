"use client";
import { Box, alpha, useTheme } from "@mui/material";
import { useRef, useEffect, useMemo } from "react";
import { useColorScheme } from "@mui/material/styles";

const baseOpacity = 0.15; // 稍微提高一點以應對雙層稀釋

export default function TrackingLight() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { mode, systemMode } = useColorScheme();
  const theme = useTheme();

  const currentMode = mode === "system" ? systemMode : mode;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    let frameId: number;
    let pendingX: number | null = null;
    let pendingY: number | null = null;

    const updateVariables = () => {
      if (pendingX !== null && pendingY !== null) {
        el.style.setProperty("--mouse-x", `${pendingX}px`);
        el.style.setProperty("--mouse-y", `${pendingY}px`);
        pendingX = null;
        pendingY = null;
      }
      frameId = requestAnimationFrame(updateVariables);
    };
    frameId = requestAnimationFrame(updateVariables);

    const handleMouseMove = (event: MouseEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // 計算顏色與透明度（僅在 theme/mode 變更時重算，不隨滑鼠重繪）
  const colors = useMemo(() => {
    const mainColor = theme.palette.primary.main;
    return {
      core: alpha(mainColor, baseOpacity),
      outer: alpha(mainColor, baseOpacity / 3),
    };
  }, [theme.palette.primary.main]);

  return (
    <Box
      ref={boxRef}
      sx={{
        "--mouse-x": "50vw",
        "--mouse-y": "50vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
        mixBlendMode: currentMode === "dark" ? "screen" : "multiply",
        // 滑鼠座標改由 CSS 變數更新，不觸發 React 重繪；移除 transition 以減輕 Safari 負擔
        background: `
          radial-gradient(
            400px circle at var(--mouse-x) var(--mouse-y),
            ${colors.core} 0%,
            transparent 60%
          ),
          radial-gradient(
            800px circle at var(--mouse-x) var(--mouse-y),
            ${colors.outer} 0%,
            transparent 80%
          )
        `,
      }}
    />
  );
}
