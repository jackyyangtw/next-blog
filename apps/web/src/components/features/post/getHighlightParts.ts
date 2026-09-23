interface HighlightPart {
  text: string;
  isHighlighted: boolean;
}

export function getHighlightParts(
  text: string,
  highlight: string,
): HighlightPart[] {
  const terms = highlight
    .trim()
    .replace(/\bnext[.\s-]+js\b/gi, "nextjs")
    .replace(/\bci[/\s-]+cd\b/gi, "cicd")
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [{ text, isHighlighted: false }];
  }

  const patterns = [...new Set(terms.map((term) => term.toLowerCase()))]
    .sort((a, b) => b.length - a.length)
    .map((term) =>
      term === "nextjs"
        ? "next[.\\s-]*js"
        : term === "cicd"
          ? "ci[/\\s-]*cd"
          : term.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"),
    );
  const expression = new RegExp(patterns.join("|"), "gi");
  const parts: HighlightPart[] = [];
  let cursor = 0;

  for (const match of text.matchAll(expression)) {
    if (match.index > cursor) {
      parts.push({
        text: text.slice(cursor, match.index),
        isHighlighted: false,
      });
    }
    parts.push({ text: match[0], isHighlighted: true });
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length || parts.length === 0) {
    parts.push({ text: text.slice(cursor), isHighlighted: false });
  }

  return parts;
}
