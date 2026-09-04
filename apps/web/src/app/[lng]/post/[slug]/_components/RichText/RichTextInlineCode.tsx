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
        px: 0.55,
        py: 0.06,
        borderRadius: 0.75,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
        color: "text.primary",
        fontFamily:
          "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "0.9em",
        fontWeight: 600,
        whiteSpace: "break-spaces",
        ...theme.applyStyles("dark", {
          borderColor: "divider",
          bgcolor: "action.selected",
          color: "text.primary",
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

function splitInlineMarkdownText(text: string, baseKey: string) {
  const parts: ReactNode[] = [];
  const inlineMarkdownPattern = /`([^`\n]+)`|(\*\*|__)(?=\S)([^\n]*?\S)\2/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineMarkdownPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      parts.push(
        <RichTextInlineCode key={`${baseKey}-code-${match.index}`}>
          {match[1]}
        </RichTextInlineCode>,
      );
    } else if (match[3] !== undefined) {
      parts.push(
        <strong key={`${baseKey}-strong-${match.index}`}>{match[3]}</strong>,
      );
    }

    lastIndex = inlineMarkdownPattern.lastIndex;
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

export function renderInlineMarkdownFallback(children: ReactNode) {
  return Children.toArray(children).flatMap((child, index) =>
    typeof child === "string"
      ? splitInlineMarkdownText(child, `inline-${index}`)
      : child,
  );
}
