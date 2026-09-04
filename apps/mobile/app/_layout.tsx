import { Stack } from "expo-router";

import AppProviders, { useAppPreferences } from "../providers/AppProviders";
import { useAppColors } from "../theme";

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

function RootNavigator() {
  const colors = useAppColors();
  const { t } = useAppPreferences();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ title: t("auth.title") }} />
      <Stack.Screen
        name="posts/[slug]"
        options={{ title: t("article.untitled") }}
      />
    </Stack>
  );
}
