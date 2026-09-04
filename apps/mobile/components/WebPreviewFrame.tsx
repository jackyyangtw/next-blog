import { useMemo } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

import { useAppColors } from "../theme";

interface WebPreviewFrameProps {
  children: React.ReactNode;
}

const desktopBreakpoint = 768;

export default function WebPreviewFrame({ children }: WebPreviewFrameProps) {
  const colors = useAppColors();
  const { height, width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDesktopWeb = Platform.OS === "web" && width >= desktopBreakpoint;
  const deviceSize = useMemo(
    () => ({
      height: Math.min(Math.max(height - 48, 520), 860),
      width: Math.min(Math.max((height - 48) * 0.5, 267), 410),
    }),
    [height],
  );

  if (!isDesktopWeb) return children;

  return (
    <View style={styles.canvas}>
      <View style={[styles.deviceShell, deviceSize]}>
        <View style={styles.deviceScreen}>{children}</View>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppColors>) {
  return StyleSheet.create({
    canvas: {
      alignItems: "center",
      backgroundColor: colors.muted,
      flex: 1,
      justifyContent: "center",
      paddingVertical: 24,
    },
    deviceScreen: {
      backgroundColor: colors.background,
      borderRadius: 30,
      flex: 1,
      overflow: "hidden",
    },
    deviceShell: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 38,
      borderWidth: 1,
      elevation: 10,
      shadowColor: "#000000",
      shadowOffset: { height: 12, width: 0 },
      shadowOpacity: 0.24,
      shadowRadius: 28,
      padding: 6,
    },
  });
}
