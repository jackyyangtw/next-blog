import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { getHomeContent } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { components, spacing, useAppColors } from "../theme";

interface FeaturedArticleProps {
  onPress: (articleId: string) => void;
}

export default function FeaturedArticle({ onPress }: FeaturedArticleProps) {
  const colors = useAppColors();
  const { locale, t } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { featuredArticle } = getHomeContent(locale);

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>{t("featured.eyebrow")}</Text>
          <Text style={styles.readTime}>{featuredArticle.readTime}</Text>
        </View>
        <Text style={styles.category}>{featuredArticle.category}</Text>
        <Text style={styles.title}>{featuredArticle.title}</Text>
        <Text style={styles.description}>{featuredArticle.description}</Text>
        <Button
          accessibilityHint={t("featured.read")}
          accessibilityLabel={`${t("featured.read")}：${featuredArticle.title}`}
          contentStyle={styles.buttonContent}
          mode="contained"
          onPress={() => onPress(featuredArticle.id)}
          style={styles.button}
        >
          {t("featured.read")}
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
