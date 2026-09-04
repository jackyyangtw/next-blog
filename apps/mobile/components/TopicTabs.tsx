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
  const { t } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
          >
            {label}
          </Chip>
        );
      })}
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    content: { gap: spacing.sm, paddingHorizontal: spacing.lg },
    tab: { backgroundColor: colors.muted, minHeight: 44 },
    tabActive: { backgroundColor: colors.primary },
  });
}
