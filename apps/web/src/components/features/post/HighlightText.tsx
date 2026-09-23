import Box from "@mui/material/Box";
import { semanticTokens } from "@jacky-dev/design-tokens";
import { getHighlightParts } from "./getHighlightParts";

interface HighlightTextProps {
  text: string;
  highlight: string;
}

const highlightedTextSx = {
  backgroundColor: `color-mix(in srgb, ${semanticTokens.light.primary} 24%, transparent)`,
  color: semanticTokens.light.primary,
  fontWeight: 800,
  borderRadius: 0.5,
  px: 0.25,
  boxDecorationBreak: "clone",
  ".dark &": {
    backgroundColor: `color-mix(in srgb, ${semanticTokens.dark.primary} 24%, transparent)`,
    color: semanticTokens.dark.primary,
  },
} as const;

export default function HighlightText({ text, highlight }: HighlightTextProps) {
  const parts = getHighlightParts(text, highlight);

  return (
    <>
      {parts.map((part, index) =>
        part.isHighlighted ? (
          <Box key={index} component="mark" sx={highlightedTextSx}>
            {part.text}
          </Box>
        ) : (
          part.text
        ),
      )}
    </>
  );
}
