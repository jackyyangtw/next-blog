import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getHomeContent } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";
import ArticleCard from "./ArticleCard";

export default function PostsScreen() {
  const colors = useAppColors();
  const { locale, t } = useAppPreferences();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);
  const { latestArticles } = getHomeContent(locale);
  const handleArticlePress = useCallback(
    (slug: string) => {
      router.push({ pathname: "/posts/[slug]", params: { slug } });
    },
    [router],
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useAppColors>,
  insets: ReturnType<typeof useSafeAreaInsets>,
) {
  return StyleSheet.create({
    articleList: { gap: spacing.md },
    content: {
      gap: spacing.xl,
      paddingBottom: Math.max(insets.bottom, 16) + 132,
      paddingHorizontal: spacing.lg,
      paddingTop: insets.top + spacing.lg,
    },
    description: {
      color: colors.mutedForeground,
      fontSize: 15,
      marginTop: spacing.xs,
    },
    screen: { backgroundColor: colors.background, flex: 1 },
    title: { color: colors.foreground, fontSize: 28, fontWeight: "700" },
  });
}
