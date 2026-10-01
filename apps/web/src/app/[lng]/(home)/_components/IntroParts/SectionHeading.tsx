import { primitiveTokens } from "@jacky-dev/design-tokens";
import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { sectionTitleSx, rem } from "../homeStyles";

export default function SectionHeading({
  id,
  number,
  compact = false,
  children,
}: {
  id: string;
  number?: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <Typography
      id={id}
      component="h2"
      sx={{
        ...sectionTitleSx,
        display: "grid",
        gridTemplateColumns: number ? "20px minmax(0, 1fr)" : "minmax(0, 1fr)",
        alignItems: "baseline",
        columnGap: rem(primitiveTokens.space.md),
        mb: compact
          ? rem(primitiveTokens.space.sm)
          : rem(primitiveTokens.space.xl),
      }}
    >
      {number ? (
        <span className="home-section-number" aria-hidden="true">
          {number}
        </span>
      ) : null}
      <span>{children}</span>
    </Typography>
  );
}
