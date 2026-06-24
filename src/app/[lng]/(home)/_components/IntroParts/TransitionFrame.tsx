"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Box, Fade, Grow, Slide, useMediaQuery } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface TransitionFrameProps {
  children: ReactNode;
  delay?: number;
  direction?: "down" | "left" | "right" | "up";
  kind?: "fade" | "grow" | "slide";
  rootMargin?: string;
  sx?: SxProps<Theme>;
  timeout?: number;
}

export default function TransitionFrame({
  children,
  delay = 0,
  direction = "up",
  kind = "fade",
  rootMargin = "0px 0px -12% 0px",
  sx,
  timeout = 520,
}: TransitionFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const activeTimeout = reduceMotion ? 0 : timeout;
  const transitionStyle = useMemo(
    () => ({ transitionDelay: reduceMotion ? "0ms" : `${delay}ms` }),
    [delay, reduceMotion],
  );

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const element = rootRef.current;
    if (!element || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.18 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible, reduceMotion, rootMargin]);

  const content = (
    <Box ref={rootRef} sx={sx} style={transitionStyle}>
      {children}
    </Box>
  );

  if (kind === "grow") {
    return (
      <Grow in={isVisible} timeout={activeTimeout} appear>
        {content}
      </Grow>
    );
  }

  if (kind === "slide") {
    return (
      <Slide
        in={isVisible}
        direction={direction}
        timeout={activeTimeout}
        appear
      >
        {content}
      </Slide>
    );
  }

  return (
    <Fade in={isVisible} timeout={activeTimeout} appear>
      {content}
    </Fade>
  );
}
