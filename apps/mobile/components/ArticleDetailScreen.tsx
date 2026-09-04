import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getHomeContent } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useAppColors();
  const { locale, t } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const { featuredArticle, latestArticles } = getHomeContent(locale);
  const article =
    latestArticles.find((item) => item.id === slug) ??
    (featuredArticle.id === slug ? featuredArticle : undefined);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.category}>
          {article?.category ?? t("article.untitled")}
        </Text>
        <Text style={styles.title}>
          {article?.title ?? t("article.notFound")}
        </Text>
        {article ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.description}>{article.description}</Text>
              <Text style={styles.readTime}>{article.readTime}</Text>
            </Card.Content>
          </Card>
        ) : (
          <View>
            <Text style={styles.description}>{t("article.backToList")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useAppColors>,
  insets: ReturnType<typeof useSafeAreaInsets>,
) {
  return StyleSheet.create({
    card: { backgroundColor: colors.card },
    category: { color: colors.primary, fontSize: 15, fontWeight: "700" },
    content: {
      gap: spacing.lg,
      paddingBottom: Math.max(insets.bottom, 16) + 132,
      paddingHorizontal: spacing.lg,
      paddingTop: insets.top + spacing.lg,
    },
    description: { color: colors.foreground, fontSize: 17, lineHeight: 28 },
    readTime: { color: colors.mutedForeground, marginTop: spacing.md },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.foreground,
      fontSize: 30,
      fontWeight: "800",
      lineHeight: 40,
    },
  });
}
