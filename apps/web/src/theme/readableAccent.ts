import { semanticTokens } from "@jacky-dev/design-tokens";

export const readableAccentSx = {
  color: semanticTokens.light.primary,
  ".dark &": { color: "primary.main" },
} as const;
