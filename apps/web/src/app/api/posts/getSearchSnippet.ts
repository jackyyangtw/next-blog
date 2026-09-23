import { getHighlightParts } from "../../../components/features/post/getHighlightParts";

export function getSearchSnippet(
  content: string,
  keyword: string,
): string | null {
  const text = content.replace(/\s+/g, " ").trim();
  if (!text || !keyword.trim()) return null;

  let position = 0;
  for (const part of getHighlightParts(text, keyword)) {
    if (part.isHighlighted) {
      let start = Math.max(0, position - 35);
      let end = Math.min(text.length, position + part.text.length + 105);
      if (start > 0) {
        const nextSpace = text.indexOf(" ", start);
        if (nextSpace !== -1 && nextSpace < position) start = nextSpace + 1;
      }
      if (end < text.length) {
        const previousSpace = text.lastIndexOf(" ", end);
        if (previousSpace > position + part.text.length) end = previousSpace;
      }
      return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
    }
    position += part.text.length;
  }

  return null;
}
