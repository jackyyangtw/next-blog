import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { useCallback } from "react";

import FloatingTabBar from "../../components/FloatingTabBar";
import { useAppPreferences } from "../../providers/AppProviders";
import { useAppColors } from "../../theme";

export default function TabLayout() {
  const colors = useAppColors();
  const { t } = useAppPreferences();
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <FloatingTabBar {...props} />,
    [],
  );

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "home-variant" : "home-variant-outline"}
              size={22}
            />
          ),
          title: t("nav.home"),
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "book-open-variant" : "book-open-variant-outline"}
              size={22}
            />
          ),
          title: t("nav.posts"),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "account" : "account-outline"}
              size={22}
            />
          ),
          title: t("nav.user"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? "cog" : "cog-outline"}
              size={22}
            />
          ),
          title: t("nav.settings"),
        }}
      />
    </Tabs>
  );
}
