import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

import { topics, type Topic } from "../data/home";
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
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {topics.map((topic) => {
        const isActive = topic === activeTopic;

        return (
          <Chip
            accessibilityLabel={`篩選主題：${topic}`}
            key={topic}
            onPress={() => onTopicPress(topic)}
            selected={isActive}
            showSelectedCheck={false}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            {topic}
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
