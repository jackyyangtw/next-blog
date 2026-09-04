import { BlurView as ExpoBlurView, type BlurViewProps } from "expo-blur";
import type { ComponentType } from "react";

const CompatibleBlurView =
  ExpoBlurView as unknown as ComponentType<BlurViewProps>;

export default CompatibleBlurView;
