import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, useAppColors } from "../theme";
import { useAppPreferences } from "../providers/AppProviders";

export default function AuthScreen() {
  const colors = useAppColors();
  const { t } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("auth.title")}</Text>
        <Text style={styles.description}>{t("auth.description")}</Text>
        <Button disabled mode="contained">
          {t("auth.pending")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    content: { gap: spacing.lg, padding: spacing.lg },
    description: {
      color: colors.mutedForeground,
      fontSize: 16,
      lineHeight: 24,
    },
    safeArea: { backgroundColor: colors.background, flex: 1 },
    title: { color: colors.foreground, fontSize: 28, fontWeight: "700" },
  });
}
