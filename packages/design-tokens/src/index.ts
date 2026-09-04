/**
 * Platform-neutral design tokens.
 *
 * Primitive values are intentionally presentation-agnostic. Web MUI and
 * React Native Paper adapt the semantic and component layers for their APIs.
 */
export const primitiveTokens = {
  color: {
    brand: {
      50: "hsl(185, 100%, 95%)",
      100: "hsl(185, 100%, 92%)",
      200: "hsl(185, 100%, 80%)",
      300: "hsl(185, 100%, 65%)",
      400: "hsl(185, 98%, 48%)",
      500: "hsl(185, 98%, 42%)",
      600: "hsl(186, 98%, 55%)",
      700: "hsl(185, 100%, 35%)",
      800: "hsl(185, 100%, 16%)",
      900: "hsl(185, 100%, 10%)",
    },
    gray: {
      50: "hsl(220, 35%, 97%)",
      100: "hsl(220, 30%, 94%)",
      200: "hsl(220, 20%, 88%)",
      300: "hsl(220, 20%, 80%)",
      400: "hsl(220, 20%, 65%)",
      500: "hsl(220, 20%, 42%)",
      600: "hsl(220, 20%, 35%)",
      700: "hsl(220, 20%, 25%)",
      800: "hsl(220, 30%, 6%)",
      900: "hsl(220, 35%, 3%)",
    },
    green: {
      50: "hsl(120, 80%, 98%)",
      100: "hsl(120, 75%, 94%)",
      200: "hsl(120, 75%, 87%)",
      300: "hsl(120, 61%, 77%)",
      400: "hsl(120, 44%, 53%)",
      500: "hsl(120, 59%, 30%)",
      600: "hsl(120, 70%, 25%)",
      700: "hsl(120, 75%, 16%)",
      800: "hsl(120, 84%, 10%)",
      900: "hsl(120, 87%, 6%)",
    },
    orange: {
      50: "hsl(45, 100%, 97%)",
      100: "hsl(45, 92%, 90%)",
      200: "hsl(45, 94%, 80%)",
      300: "hsl(45, 90%, 65%)",
      400: "hsl(45, 90%, 40%)",
      500: "hsl(45, 90%, 35%)",
      600: "hsl(45, 91%, 25%)",
      700: "hsl(45, 94%, 20%)",
      800: "hsl(45, 95%, 16%)",
      900: "hsl(45, 93%, 12%)",
    },
    red: {
      50: "hsl(0, 100%, 97%)",
      100: "hsl(0, 92%, 90%)",
      200: "hsl(0, 94%, 80%)",
      300: "hsl(0, 90%, 65%)",
      400: "hsl(0, 90%, 40%)",
      500: "hsl(0, 90%, 30%)",
      600: "hsl(0, 91%, 25%)",
      700: "hsl(0, 94%, 18%)",
      800: "hsl(0, 95%, 12%)",
      900: "hsl(0, 93%, 6%)",
    },
  },
  radius: { sm: 8, md: 12, lg: 20, xl: 24, full: 999 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  typography: {
    body: 16,
    caption: 12,
    heading1: 48,
    heading2: 36,
    heading3: 30,
    heading4: 24,
    heading5: 20,
    heading6: 18,
  },
} as const;

const { brand, gray, green, orange, red } = primitiveTokens.color;

export const semanticTokens = {
  dark: {
    accent: brand[400],
    background: gray[900],
    border: gray[700],
    card: "hsl(220, 30%, 7%)",
    foreground: "hsl(0, 0%, 100%)",
    muted: gray[800],
    mutedForeground: gray[400],
    navigationGlass: "hsla(220, 30%, 12%, 0.72)",
    navigationGlassActive: "hsla(0, 0%, 100%, 0.12)",
    onPrimary: brand[50],
    primary: brand[400],
    secondary: gray[600],
  },
  light: {
    accent: brand[400],
    background: gray[100],
    border: gray[300],
    card: gray[50],
    foreground: gray[800],
    muted: gray[100],
    mutedForeground: gray[600],
    navigationGlass: "hsla(220, 35%, 97%, 0.72)",
    navigationGlassActive: "hsla(0, 0%, 100%, 0.56)",
    onPrimary: brand[50],
    primary: brand[400],
    secondary: gray[600],
  },
  status: { error: red[400], success: green[400], warning: orange[400] },
} as const;

export const componentTokens = {
  articleCard: { radius: primitiveTokens.radius.lg },
  button: { minHeight: 52, radius: primitiveTokens.radius.md },
  featuredCard: { radius: primitiveTokens.radius.xl },
} as const;
