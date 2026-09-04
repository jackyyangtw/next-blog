import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { featuredArticle } from "../data/home";
import { components, spacing, useAppColors } from "../theme";

interface FeaturedArticleProps {
  onPress: (articleId: string) => void;
}

export default function FeaturedArticle({ onPress }: FeaturedArticleProps) {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>本週精選</Text>
          <Text style={styles.readTime}>{featuredArticle.readTime}</Text>
        </View>
        <Text style={styles.category}>{featuredArticle.category}</Text>
        <Text style={styles.title}>{featuredArticle.title}</Text>
        <Text style={styles.description}>{featuredArticle.description}</Text>
        <Button
          accessibilityHint="開啟本週精選文章"
          accessibilityLabel={`閱讀精選文章：${featuredArticle.title}`}
          contentStyle={styles.buttonContent}
          mode="contained"
          onPress={() => onPress(featuredArticle.id)}
          style={styles.button}
        >
          開始閱讀
        </Button>
      </Card.Content>
    </Card>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    button: { marginTop: spacing.md },
    buttonContent: { minHeight: components.button.minHeight },
    card: {
      borderColor: colors.border,
      borderRadius: components.featuredCard.radius,
    },
    category: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: "700",
      marginTop: spacing.sm,
    },
    content: { gap: spacing.sm, padding: spacing.lg },
    description: {
      color: colors.mutedForeground,
      fontSize: 16,
      lineHeight: 25,
    },
    eyebrow: { color: colors.foreground, fontSize: 14, fontWeight: "700" },
    readTime: { color: colors.mutedForeground, fontSize: 13 },
    title: {
      color: colors.foreground,
      fontSize: 30,
      fontWeight: "700",
      letterSpacing: -0.8,
      lineHeight: 38,
    },
    topRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
}
