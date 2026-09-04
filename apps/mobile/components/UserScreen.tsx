import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, useAppColors } from "../theme";
import { useAppPreferences } from "../providers/AppProviders";

export default function UserScreen() {
  const colors = useAppColors();
  const { t } = useAppPreferences();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const handleLoginPress = useCallback(() => {
    router.push("/auth");
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("user.title")}</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>{t("user.notSignedIn")}</Text>
            <Text style={styles.description}>{t("user.description")}</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleLoginPress}>
              {t("user.goToLogin")}
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    card: { backgroundColor: colors.card },
    cardTitle: { color: colors.foreground, fontSize: 18, fontWeight: "700" },
    content: { gap: spacing.lg, padding: spacing.lg },
    description: { color: colors.mutedForeground, marginTop: spacing.xs },
    safeArea: { backgroundColor: colors.background, flex: 1 },
    title: { color: colors.foreground, fontSize: 28, fontWeight: "700" },
  });
}
