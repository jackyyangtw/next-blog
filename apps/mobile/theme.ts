import {
  componentTokens,
  primitiveTokens,
  semanticTokens,
} from "@jacky-dev/design-tokens";
import { MD3LightTheme } from "react-native-paper";

export const colors = semanticTokens.light;
export const components = componentTokens;
export const spacing = primitiveTokens.space;

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: colors.background,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: colors.card,
      level2: colors.card,
    },
    onPrimary: colors.onPrimary,
    onPrimaryContainer: colors.onPrimary,
    onSecondaryContainer: colors.foreground,
    onSurface: colors.foreground,
    onSurfaceVariant: colors.mutedForeground,
    outline: colors.border,
    primary: colors.primary,
    primaryContainer: colors.primary,
    secondary: colors.secondary,
    secondaryContainer: colors.muted,
    surface: colors.card,
    surfaceVariant: colors.muted,
  },
  roundness: 3,
};
