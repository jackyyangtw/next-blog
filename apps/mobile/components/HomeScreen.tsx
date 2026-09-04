import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { latestArticles, type Topic } from "../data/home";
import { colors, spacing } from "../theme";
import ArticleCard from "./ArticleCard";
import FeaturedArticle from "./FeaturedArticle";
import TopicTabs from "./TopicTabs";

export default function HomeScreen() {
  const [activeTopic, setActiveTopic] = useState<Topic>("全部");

  const visibleArticles = useMemo(() => {
    if (activeTopic === "全部") return latestArticles;
    return latestArticles.filter((article) => article.category === activeTopic);
  }, [activeTopic]);

  const handleArticlePress = useCallback((articleId: string) => {
    const article = latestArticles.find((item) => item.id === articleId);
    if (article)
      Alert.alert("文章預覽", `「${article.title}」的完整內容即將推出。`);
  }, []);

  const handleTopicPress = useCallback((topic: Topic) => {
    setActiveTopic(topic);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>JACKY DEV</Text>
          <Text style={styles.subtitle}>寫給持續打磨產品的人</Text>
        </View>
        <View style={styles.inset}>
          <FeaturedArticle onPress={handleArticlePress} />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>探索主題</Text>
          <Text style={styles.articleCount}>
            {visibleArticles.length} 篇文章
          </Text>
        </View>
        <View style={styles.tabsContainer}>
          <TopicTabs
            activeTopic={activeTopic}
            onTopicPress={handleTopicPress}
          />
        </View>
        <View style={[styles.inset, styles.articleList]}>
          {visibleArticles.map((article) => (
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

const styles = StyleSheet.create({
  articleCount: { color: colors.mutedForeground, fontSize: 14 },
  articleList: { gap: spacing.md },
  brand: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2.4,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  header: { gap: spacing.xs, paddingHorizontal: spacing.lg },
  inset: { paddingHorizontal: spacing.lg },
  safeArea: { backgroundColor: colors.background, flex: 1 },
  sectionHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: { color: colors.foreground, fontSize: 22, fontWeight: "700" },
  subtitle: { color: colors.mutedForeground, fontSize: 15 },
  tabsContainer: { marginHorizontal: -spacing.lg },
});
