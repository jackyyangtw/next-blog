import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./components/HomeScreen";
import { paperTheme } from "./theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PaperProvider theme={paperTheme}>
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
