import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { featuredArticle, latestArticles } from "../data/home";
import { spacing, useAppColors } from "../theme";

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const article =
    latestArticles.find((item) => item.id === slug) ??
    (featuredArticle.id === slug ? featuredArticle : undefined);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.category}>{article?.category ?? "文章"}</Text>
        <Text style={styles.title}>{article?.title ?? "找不到這篇文章"}</Text>
        {article ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.description}>{article.description}</Text>
              <Text style={styles.readTime}>{article.readTime}</Text>
            </Card.Content>
          </Card>
        ) : (
          <View>
            <Text style={styles.description}>
              請返回文章列表，選擇其他文章。
            </Text>
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
