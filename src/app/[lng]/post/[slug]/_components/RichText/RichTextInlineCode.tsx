import type { ReactNode } from "react";
import { Children } from "react";

import Box from "@mui/material/Box";

interface RichTextInlineCodeProps {
  children: ReactNode;
}

export function RichTextInlineCode({ children }: RichTextInlineCodeProps) {
  return (
    <Box
      component="code"
      sx={(theme) => ({
        px: 0.65,
        py: 0.08,
        borderRadius: 0.75,
        border: "1px solid",
        borderColor: "rgba(8, 145, 178, 0.22)",
        bgcolor: "rgba(8, 145, 178, 0.1)",
        color: "primary.dark",
        fontFamily:
          "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "0.92em",
        fontWeight: 700,
        whiteSpace: "break-spaces",
        ...theme.applyStyles("dark", {
          borderColor: "rgba(103, 232, 249, 0.24)",
          bgcolor: "rgba(34, 211, 238, 0.14)",
          color: "#7dd3fc",
        }),
      })}
    >
      {children}
    </Box>
  );
}

function splitInlineCodeText(text: string, baseKey: string) {
  const parts: ReactNode[] = [];
  const inlineCodePattern = /`([^`\n]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineCodePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <RichTextInlineCode key={`${baseKey}-${match.index}`}>
        {match[1]}
      </RichTextInlineCode>,
    );
    lastIndex = inlineCodePattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
}

export function renderInlineCodeFallback(children: ReactNode) {
  return Children.toArray(children).flatMap((child, index) =>
    typeof child === "string"
      ? splitInlineCodeText(child, `inline-${index}`)
      : child,
  );
}
