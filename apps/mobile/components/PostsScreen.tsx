import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { getHomeContent } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";
import ArticleCard from "./ArticleCard";

export default function PostsScreen() {
  const colors = useAppColors();
  const { locale, t } = useAppPreferences();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { latestArticles } = getHomeContent(locale);
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
          <Text style={styles.title}>{t("posts.title")}</Text>
          <Text style={styles.description}>{t("posts.description")}</Text>
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
