import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import type { ArticlePreview } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { components, spacing, useAppColors } from "../theme";

interface ArticleCardProps {
  article: ArticlePreview;
  onPress: (articleId: string) => void;
}

export default function ArticleCard({ article, onPress }: ArticleCardProps) {
  const colors = useAppColors();
  const { t } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Card
      accessibilityHint={t("common.readArticle")}
      accessibilityLabel={`${t("common.readArticle")}：${article.title}`}
      accessible
      mode="outlined"
      onPress={() => onPress(article.id)}
      style={styles.card}
    >
      <Card.Content style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.readTime}>{article.readTime}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {article.description}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onPress(article.id)}>
          {t("common.readArticle")}
        </Button>
      </Card.Actions>
    </Card>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    card: {
      borderColor: colors.border,
      borderRadius: components.articleCard.radius,
      minHeight: 180,
    },
    category: { color: colors.accent, fontSize: 13, fontWeight: "700" },
    content: { gap: spacing.sm, paddingTop: spacing.md },
    description: {
      color: colors.mutedForeground,
      fontSize: 15,
      lineHeight: 23,
    },
    metaRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    readTime: { color: colors.mutedForeground, fontSize: 13 },
    title: {
      color: colors.foreground,
      fontSize: 20,
      fontWeight: "700",
      lineHeight: 28,
    },
  });
}
