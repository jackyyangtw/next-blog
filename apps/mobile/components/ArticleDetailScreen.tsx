import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { getHomeContent } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useAppColors();
  const { locale, t } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { featuredArticle, latestArticles } = getHomeContent(locale);
  const article =
    latestArticles.find((item) => item.id === slug) ??
    (featuredArticle.id === slug ? featuredArticle : undefined);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
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
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    card: { backgroundColor: colors.card },
    category: { color: colors.primary, fontSize: 15, fontWeight: "700" },
    content: { gap: spacing.lg, padding: spacing.lg },
    description: { color: colors.foreground, fontSize: 17, lineHeight: 28 },
    readTime: { color: colors.mutedForeground, marginTop: spacing.md },
    safeArea: { backgroundColor: colors.background, flex: 1 },
    title: {
      color: colors.foreground,
      fontSize: 30,
      fontWeight: "800",
      lineHeight: 40,
    },
  });
}
