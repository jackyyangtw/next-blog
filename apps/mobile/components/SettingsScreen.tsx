import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Switch, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";

export default function SettingsScreen() {
  const colors = useAppColors();
  const { isDark, locale, setLocale, t, toggleTheme } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const handleChineseLocale = useCallback(() => {
    setLocale("zh-TW");
  }, [setLocale]);
  const handleEnglishLocale = useCallback(() => {
    setLocale("en");
  }, [setLocale]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("settings.title")}</Text>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View>
              <Text style={styles.sectionTitle}>
                {t("settings.appearance")}
              </Text>
              <Text style={styles.description}>
                {t("settings.darkModeDescription")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t("settings.darkMode")}</Text>
              <Switch
                accessibilityLabel={t("settings.darkMode")}
                onValueChange={toggleTheme}
                value={isDark}
              />
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View>
              <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
              <Text style={styles.description}>
                {t("settings.languageDescription")}
              </Text>
            </View>
            <View style={styles.languageActions}>
              <Button
                mode={locale === "zh-TW" ? "contained" : "outlined"}
                onPress={handleChineseLocale}
                style={styles.languageButton}
              >
                繁中
              </Button>
              <Button
                mode={locale === "en" ? "contained" : "outlined"}
                onPress={handleEnglishLocale}
                style={styles.languageButton}
              >
                English
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    card: { backgroundColor: colors.card },
    cardContent: { gap: spacing.md, padding: spacing.lg },
    content: { gap: spacing.md, padding: spacing.lg },
    description: {
      color: colors.mutedForeground,
      fontSize: 15,
      lineHeight: 22,
    },
    languageActions: { flexDirection: "row", gap: spacing.sm },
    languageButton: { flex: 1, minHeight: 44 },
    row: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rowLabel: { color: colors.foreground, fontSize: 16, fontWeight: "600" },
    safeArea: { backgroundColor: colors.background, flex: 1 },
    sectionTitle: { color: colors.foreground, fontSize: 18, fontWeight: "700" },
    title: { color: colors.foreground, fontSize: 28, fontWeight: "700" },
  });
}
