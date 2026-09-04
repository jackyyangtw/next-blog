import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";

const barHeight = 60;
const barRadius = 30;
const itemRadius = 24;

export default function FloatingTabBar({
  descriptors,
  navigation,
  state,
}: BottomTabBarProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const blurTint = isDark
    ? "systemThinMaterialDark"
    : "systemThinMaterialLight";

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: Math.max(insets.bottom, 16) }]}
    >
      <BlurView intensity={72} style={styles.bar} tint={blurTint}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = getTabLabel(options, route.name);
          const color = isFocused ? colors.primary : colors.mutedForeground;
          const icon = options.tabBarIcon?.({
            color,
            focused: isFocused,
            size: 20,
          });
          const handlePress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: "tabPress",
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              key={route.key}
              onLongPress={() =>
                navigation.emit({ target: route.key, type: "tabLongPress" })
              }
              onPress={handlePress}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
            >
              {isFocused ? (
                <View pointerEvents="none" style={styles.activeSurface}>
                  <BlurView
                    intensity={28}
                    style={styles.activeBlur}
                    tint={blurTint}
                  />
                </View>
              ) : null}
              <View style={styles.itemContent}>
                {icon}
                <Text style={[styles.label, { color }]}>{label}</Text>
              </View>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

function getTabLabel(
  options: BottomTabBarProps["descriptors"][string]["options"],
  fallback: string,
) {
  const label = options.tabBarLabel ?? options.title ?? fallback;

  return typeof label === "string" ? label : fallback;
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    activeBlur: {
      bottom: 0,
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
    },
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
    bar: {
      alignSelf: "stretch",
      alignItems: "center",
      backgroundColor: colors.navigationGlass,
      borderColor: colors.border,
      borderRadius: barRadius,
      borderWidth: 1,
      elevation: 8,
      flexDirection: "row",
      height: barHeight,
      overflow: "hidden",
      padding: 6,
      shadowColor: colors.border,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
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
    wrapper: {
      alignItems: "center",
      left: spacing.lg,
      position: "absolute",
      right: spacing.lg,
    },
  });
}
