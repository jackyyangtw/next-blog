import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./components/HomeScreen";
import { paperThemes } from "./theme";

export default function App() {
  const colorScheme = useColorScheme();
  const [themeOverride, setThemeOverride] = useState<"dark" | "light" | null>(
    null,
  );
  const isDark = (themeOverride ?? colorScheme) === "dark";

  const handleThemeToggle = useCallback(() => {
    setThemeOverride((currentOverride) => {
      const currentMode = currentOverride ?? colorScheme;

      return currentMode === "dark" ? "light" : "dark";
    });
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <PaperProvider theme={isDark ? paperThemes.dark : paperThemes.light}>
        <HomeScreen isDark={isDark} onThemeToggle={handleThemeToggle} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
