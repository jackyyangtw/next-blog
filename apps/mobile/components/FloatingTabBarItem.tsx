import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type AccessibilityState,
} from "react-native";

import { useAppColors } from "../theme";

const itemRadius = 24;

interface FloatingTabBarItemProps {
  accessibilityLabel?: string;
  color: string;
  icon: React.ReactNode;
  isFocused: boolean;
  label: string;
  onLongPress: () => void;
  onPress: () => void;
}

export default function FloatingTabBarItem({
  accessibilityLabel,
  color,
  icon,
  isFocused,
  label,
  onLongPress,
  onPress,
}: FloatingTabBarItemProps) {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focusProgress] = useState(() => new Animated.Value(isFocused ? 1 : 0));
  const accessibilityState = useMemo<AccessibilityState>(
    () => ({ selected: isFocused }),
    [isFocused],
  );

  useEffect(() => {
    Animated.spring(focusProgress, {
      damping: 18,
      mass: 0.85,
      stiffness: 220,
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [focusProgress, isFocused]);

  const activeOpacity = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const activeScale = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1],
  });
  const contentScale = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="tab"
      accessibilityState={accessibilityState}
      onLongPress={onLongPress}
      onPress={handlePress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeSurface,
          { opacity: activeOpacity, transform: [{ scale: activeScale }] },
        ]}
      ></Animated.View>
      <Animated.View
        style={[styles.itemContent, { transform: [{ scale: contentScale }] }]}
      >
        {icon}
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    activeSurface: {
      backgroundColor: colors.navigationGlassActive,
      borderRadius: itemRadius,
      bottom: 0,
      left: 0,
      overflow: "hidden",
      position: "absolute",
      right: 0,
      top: 0,
    },
    item: {
      alignItems: "center",
      borderRadius: itemRadius,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
      overflow: "hidden",
    },
    itemContent: { alignItems: "center", gap: 2, justifyContent: "center" },
    itemPressed: { opacity: 0.72 },
    label: { fontSize: 11, fontWeight: "600" },
  });
}
