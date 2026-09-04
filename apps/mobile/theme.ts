import {
  componentTokens,
  primitiveTokens,
  semanticTokens,
} from "@jacky-dev/design-tokens";
import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
  useTheme,
} from "react-native-paper";

export type AppColors =
  | typeof semanticTokens.dark
  | typeof semanticTokens.light;

export const components = componentTokens;
export const spacing = primitiveTokens.space;

function createPaperTheme(baseTheme: MD3Theme, colors: AppColors) {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      elevation: {
        ...baseTheme.colors.elevation,
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
}

export const paperThemes = {
  dark: createPaperTheme(MD3DarkTheme, semanticTokens.dark),
  light: createPaperTheme(MD3LightTheme, semanticTokens.light),
};

export function useAppColors(): AppColors {
  const theme = useTheme<MD3Theme>();

  return theme.dark ? semanticTokens.dark : semanticTokens.light;
}
