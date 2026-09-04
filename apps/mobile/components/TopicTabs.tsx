import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

import { topics, type Topic } from "../data/home";
import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";

interface TopicTabsProps {
  activeTopic: Topic;
  onTopicPress: (topic: Topic) => void;
}

export default function TopicTabs({
  activeTopic,
  onTopicPress,
}: TopicTabsProps) {
  const colors = useAppColors();
  const { isDark, t } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {topics.map((topic) => {
        const isActive = topic === activeTopic;
        const label = topic === "全部" ? t("topic.all") : topic;

        return (
          <Chip
            accessibilityLabel={t("topic.filter", { topic: label })}
            key={topic}
            onPress={() => onTopicPress(topic)}
            selected={isActive}
            showSelectedCheck={false}
            style={[styles.tab, isActive && styles.tabActive]}
            textStyle={isActive ? styles.tabActiveText : styles.tabText}
          >
            {label}
          </Chip>
        );
      })}
    </ScrollView>
  );
}

function createStyles(
  colors: ReturnType<typeof useAppColors>,
  isDark: boolean,
) {
  return StyleSheet.create({
    content: { gap: spacing.sm, paddingHorizontal: spacing.lg },
    tab: { backgroundColor: colors.muted, minHeight: 44 },
    tabActive: {
      backgroundColor: colors.navigationGlassActive,
      borderColor: colors.border,
      borderWidth: 1,
    },
    tabActiveText: {
      color: isDark ? colors.foreground : colors.primary,
      fontWeight: "700",
    },
    tabText: { color: colors.foreground },
  });
}
