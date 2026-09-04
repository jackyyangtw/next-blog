import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, useAppColors } from "../theme";

export default function UserScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const handleLoginPress = useCallback(() => {
    router.push("/auth");
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>我的帳號</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>尚未登入</Text>
            <Text style={styles.description}>登入後即可同步你的收藏文章。</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleLoginPress}>
              前往登入
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
