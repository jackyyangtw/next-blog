import type { MouseEvent, ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

interface PostScrollSpyLinkProps {
  children: ReactNode;
  id: string;
  isActive: boolean;
  level: "section" | "child";
  onClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function PostScrollSpyLink({
  children,
  id,
  isActive,
  level,
  onClick,
}: PostScrollSpyLinkProps) {
  const isSection = level === "section";

  return (
    <Typography
      component="a"
      href={`#${id}`}
      variant="body2"
      onClick={(event) => onClick(event, id)}
      data-scroll-spy-active={isActive ? "true" : undefined}
      sx={(theme) => ({
        display: "block",
        px: 1,
        py: isSection ? 0.35 : 0.3,
        borderRadius: 1,
        backgroundColor: isActive
          ? alpha(theme.palette.primary.main, 0.12)
          : "transparent",
        color: isActive ? "text.primary" : "text.secondary",
        fontWeight: isActive ? 700 : isSection ? 600 : 500,
        lineHeight: isSection ? 1.7 : 1.65,
        textDecoration: "none",
        transition: "color 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          color: "text.primary",
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
        ...theme.applyStyles("dark", {
          backgroundColor: isActive
            ? alpha(theme.palette.primary.light, 0.16)
            : "transparent",
          "&:hover": {
            color: "text.primary",
            backgroundColor: alpha(theme.palette.primary.light, 0.12),
          },
        }),
      })}
    >
      {children}
    </Typography>
  );
}
