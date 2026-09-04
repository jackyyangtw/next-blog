import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import WebPreviewFrame from "../components/WebPreviewFrame";
import { paperThemes } from "../theme";

interface AppThemePreference {
  isDark: boolean;
  toggleTheme: () => void;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppThemePreferenceContext = createContext<AppThemePreference | null>(
  null,
);

export default function AppProviders({ children }: AppProvidersProps) {
  const colorScheme = useColorScheme();
  const [themeOverride, setThemeOverride] = useState<"dark" | "light" | null>(
    null,
  );
  const isDark = (themeOverride ?? colorScheme) === "dark";
  const toggleTheme = useCallback(() => {
    setThemeOverride((currentOverride) => {
      const currentMode = currentOverride ?? colorScheme;

      return currentMode === "dark" ? "light" : "dark";
    });
  }, [colorScheme]);
  const preference = useMemo(
    () => ({ isDark, toggleTheme }),
    [isDark, toggleTheme],
  );

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <PaperProvider theme={isDark ? paperThemes.dark : paperThemes.light}>
        <AppThemePreferenceContext.Provider value={preference}>
          <WebPreviewFrame>{children}</WebPreviewFrame>
        </AppThemePreferenceContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export function useAppThemePreference(): AppThemePreference {
  const preference = useContext(AppThemePreferenceContext);

  if (!preference) {
    throw new Error("useAppThemePreference 必須在 AppProviders 內使用。");
  }

  return preference;
}
