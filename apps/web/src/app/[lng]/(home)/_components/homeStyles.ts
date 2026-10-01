import { primitiveTokens } from "@jacky-dev/design-tokens";
import type { SxProps, Theme } from "@mui/material/styles";

export function rem(value: number): string {
  return `${value / 16}rem`;
}

const accentSx = {
  color: "primary.dark",
  ".dark &": { color: "primary.main" },
} as const;

export const sectionTitleSx = {
  fontFamily: "inherit",
  fontSize: rem(primitiveTokens.typography.heading4),
  fontWeight: 600,
  lineHeight: 1.4,
  mb: rem(primitiveTokens.space.lg),
  overflowWrap: "anywhere",
} satisfies SxProps<Theme>;

export const bodyCopySx = {
  color: "text.secondary",
  fontSize: rem(primitiveTokens.typography.body),
  lineHeight: 1.85,
  overflowWrap: "anywhere",
} satisfies SxProps<Theme>;

export const homeRootSx = {
  minWidth: 0,
  fontFamily: "inherit",
  bgcolor: "background.default",
  color: "text.primary",
  "& .home-text-link": {
    display: "inline-flex",
    alignItems: "center",
    gap: rem(primitiveTokens.space.sm),
    minHeight: 44,
    color: "text.primary",
    fontSize: rem(primitiveTokens.typography.small),
    textDecoration: "underline",
    textDecorationColor: "var(--template-palette-divider)",
    textUnderlineOffset: "0.3em",
    whiteSpace: "nowrap",
    transition: "color 200ms ease, text-decoration-color 200ms ease",
    "&:hover": {
      ...accentSx,
      textDecorationColor: "currentColor",
    },
  },
  "& .home-post-link": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    alignItems: "center",
    gap: {
      xs: rem(primitiveTokens.space.md),
      sm: rem(primitiveTokens.space.xl),
      lg: rem(primitiveTokens.space["3xl"]),
    },
    paddingBlock: rem(primitiveTokens.space.lg),
    paddingInline: rem(primitiveTokens.space.sm),
    marginInline: rem(-primitiveTokens.space.sm),
    bgcolor: "transparent",
    color: "text.primary",
    textDecoration: "none",
    transition: "background-color 200ms ease",
    "&:hover, &:focus-visible": { bgcolor: "action.hover" },
    "&[data-has-banner='true']": {
      gridTemplateColumns: {
        xs: "minmax(0, 1fr) 80px",
        sm: "minmax(0, 1fr) 144px",
        md: "minmax(0, 1fr) 176px",
        lg: "minmax(0, 1fr) 208px",
      },
    },
    "& h3": { transition: "color 200ms ease" },
    "&:hover h3, &:focus-visible h3": accentSx,
  },
  "& .home-section-number": {
    ...accentSx,
    fontFamily: primitiveTokens.fontFamily.monospace.join(", "),
    fontSize: rem(primitiveTokens.typography.body),
    fontWeight: 400,
    lineHeight: 1.4,
  },
  "& .home-principle-number": {
    color: "text.secondary",
    fontFamily: primitiveTokens.fontFamily.monospace.join(", "),
    fontSize: rem(primitiveTokens.typography.caption),
    fontWeight: 400,
  },
  "& .home-text-link:focus-visible, & .home-post-link:focus-visible": {
    outline: "2px solid var(--template-palette-text-primary)",
    outlineOffset: 4,
  },
  "& .home-text-link:active, & .home-post-link:active": { opacity: 0.7 },
  "@media (prefers-reduced-motion: reduce)": {
    "& .home-text-link, & .home-post-link, & .home-post-link h3": {
      transition: "none",
    },
  },
} satisfies SxProps<Theme>;
