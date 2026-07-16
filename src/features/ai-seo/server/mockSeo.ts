import "server-only";

import type { GenerateSeoRequest, SeoSuggestion } from "../types";

function truncate(input: string, maxLength: number) {
  return input.length > maxLength
    ? `${input.slice(0, maxLength - 1)}...`
    : input;
}

function firstSentence(content: string) {
  return (
    content
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)[0]
      ?.trim() || content.slice(0, 120)
  );
}

export function mockSeo(input: GenerateSeoRequest): SeoSuggestion {
  const fallbackTitle = "Practical Frontend Engineering Notes";
  const titleBase =
    input.title || firstSentence(input.content) || fallbackTitle;
  const keywordSeed =
    input.categories.length > 0
      ? input.categories
      : ["frontend", "Next.js", "SEO"];

  return {
    title: truncate(titleBase, 68),
    description: truncate(
      input.description ||
        `${firstSentence(input.content)} Learn the key implementation decisions and practical trade-offs.`,
      158,
    ),
    keywords: Array.from(new Set(keywordSeed)).slice(0, 8),
    searchIntent:
      "Readers want a practical explanation they can apply in a real project.",
    rationale:
      "This preview is based on the current title, category context, and article opening. Review tone and specificity before applying.",
  };
}
