import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CompatibleBlurView from "./CompatibleBlurView";
import FloatingTabBarItem from "./FloatingTabBarItem";
import { useAppPreferences } from "../providers/AppProviders";
import { spacing, useAppColors } from "../theme";

const barHeight = 60;
const barRadius = 30;

export default function FloatingTabBar({
  descriptors,
  navigation,
  state,
}: BottomTabBarProps) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { isDark } = useAppPreferences();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const blurTint = isDark
    ? "systemUltraThinMaterialDark"
    : "systemUltraThinMaterialLight";
  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: Math.max(insets.bottom, 16) }]}
    >
      <CompatibleBlurView intensity={72} style={styles.bar} tint={blurTint}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = getTabLabel(options, route.name);
          const color = isFocused
            ? isDark
              ? colors.foreground
              : colors.primary
            : colors.mutedForeground;
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
            <FloatingTabBarItem
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              color={color}
              icon={icon}
              isFocused={isFocused}
              key={route.key}
              onLongPress={() =>
                navigation.emit({ target: route.key, type: "tabLongPress" })
              }
              onPress={handlePress}
              label={label}
            />
          );
        })}
      </CompatibleBlurView>
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

function createStyles(
  colors: ReturnType<typeof useAppColors>,
  isDark: boolean,
) {
  return StyleSheet.create({
    bar: {
      alignSelf: "stretch",
      alignItems: "center",
      backgroundColor: isDark
        ? "hsla(220, 30%, 12%, 0.34)"
        : "hsla(220, 35%, 97%, 0.36)",
      borderColor: isDark
        ? "hsla(0, 0%, 100%, 0.16)"
        : "hsla(220, 20%, 20%, 0.1)",
      borderRadius: barRadius,
      borderWidth: 1,
      elevation: 8,
      flexDirection: "row",
      height: barHeight,
      overflow: "hidden",
      padding: 6,
      shadowColor: colors.border,
      shadowOffset: { height: 10, width: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
    wrapper: {
      alignItems: "center",
      left: spacing.lg,
      position: "absolute",
      right: spacing.lg,
    },
  });
}
