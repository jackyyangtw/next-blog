import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { latestArticles } from "../data/home";
import { spacing, useAppColors } from "../theme";
import ArticleCard from "./ArticleCard";

export default function PostsScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const handleArticlePress = useCallback(
    (slug: string) => {
      router.push({ pathname: "/posts/[slug]", params: { slug } });
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>所有文章</Text>
          <Text style={styles.description}>
            持續累積產品、前端與 AI 的實作筆記。
          </Text>
        </View>
        <View style={styles.articleList}>
          {latestArticles.map((article) => (
            <ArticleCard
              article={article}
              key={article.id}
              onPress={handleArticlePress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    articleList: { gap: spacing.md },
    content: { gap: spacing.xl, padding: spacing.lg },
    description: {
      color: colors.mutedForeground,
      fontSize: 15,
      marginTop: spacing.xs,
    },
    safeArea: { backgroundColor: colors.background, flex: 1 },
    title: { color: colors.foreground, fontSize: 28, fontWeight: "700" },
  });
}
