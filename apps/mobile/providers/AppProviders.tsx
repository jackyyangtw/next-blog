import { createContext, useCallback, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useLocales } from "expo-localization";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import WebPreviewFrame from "../components/WebPreviewFrame";
import {
  getAppLocale,
  translate,
  type AppLocale,
  type TranslationKey,
  type TranslationValues,
} from "../i18n";
import {
  updateAppPreferences,
  useStoredAppPreferences,
} from "../stores/appPreferences";
import { paperThemes } from "../theme";

interface AppPreferences {
  isDark: boolean;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
  toggleLocale: () => void;
  toggleTheme: () => void;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppPreferencesContext = createContext<AppPreferences | null>(null);

export default function AppProviders({ children }: AppProvidersProps) {
  const colorScheme = useColorScheme();
  const deviceLocales = useLocales();
  const { localeOverride, themeOverride } = useStoredAppPreferences();
  const isDark = (themeOverride ?? colorScheme) === "dark";
  const systemLocale = getAppLocale(deviceLocales[0]?.languageCode);
  const locale = localeOverride ?? systemLocale;
  const toggleTheme = useCallback(() => {
    const currentMode = themeOverride ?? colorScheme;

    updateAppPreferences({
      themeOverride: currentMode === "dark" ? "light" : "dark",
    });
  }, [colorScheme, themeOverride]);
  const setLocale = useCallback((nextLocale: AppLocale) => {
    updateAppPreferences({ localeOverride: nextLocale });
  }, []);
  const toggleLocale = useCallback(() => {
    const currentLocale = localeOverride ?? systemLocale;

    updateAppPreferences({
      localeOverride: currentLocale === "zh-TW" ? "en" : "zh-TW",
    });
  }, [localeOverride, systemLocale]);
  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) =>
      translate(locale, key, values),
    [locale],
  );
  const preference = useMemo(
    () => ({ isDark, locale, setLocale, t, toggleLocale, toggleTheme }),
    [isDark, locale, setLocale, t, toggleLocale, toggleTheme],
  );

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <PaperProvider theme={isDark ? paperThemes.dark : paperThemes.light}>
        <AppPreferencesContext.Provider value={preference}>
          <WebPreviewFrame>{children}</WebPreviewFrame>
        </AppPreferencesContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export function useAppPreferences(): AppPreferences {
  const preference = useContext(AppPreferencesContext);

  if (!preference) {
    throw new Error("useAppPreferences 必須在 AppProviders 內使用。");
  }

  return preference;
}
