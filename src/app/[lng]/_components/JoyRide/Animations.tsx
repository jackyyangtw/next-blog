import { GlobalStyles } from "@mui/material";

export const FADE_IN_ANIMATION = "joyride-fade-in";

export const FADE_IN_ANIMATION_DURATION = 300;

export default function Animations() {
  return (
    <GlobalStyles
      styles={{
        "@keyframes joyride-fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    />
  );
}
