"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";

// ------------- i18n -------------
import { getMUILocale, fallbackLng } from "@/i18n/config";
import { Locale } from "@/i18n/types";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
  locale?: Locale;
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents, locale } = props;
  const theme = React.useMemo(() => {
    const muiLocale = getMUILocale(locale ?? fallbackLng);
    return disableCustomTheme
      ? {}
      : createTheme(
          {
            // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
            cssVariables: {
              colorSchemeSelector: "class",
              cssVarPrefix: "template",
            },
            colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
            typography,
            shadows,
            shape,
            components: {
              ...inputsCustomizations,
              ...dataDisplayCustomizations,
              ...feedbackCustomizations,
              ...navigationCustomizations,
              ...surfacesCustomizations,
              ...themeComponents,
            },
          },
          muiLocale
        );
  }, [disableCustomTheme, themeComponents, locale]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
