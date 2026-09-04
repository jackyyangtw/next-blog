import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, useAppColors } from "../theme";

export default function AuthScreen() {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>登入 Jacky Dev</Text>
        <Text style={styles.description}>登入後可管理收藏文章與個人資料。</Text>
        <Button disabled mode="contained">
          登入串接準備中
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
