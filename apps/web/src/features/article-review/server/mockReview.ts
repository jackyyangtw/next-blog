import "server-only";

import type { ReviewArticleRequest, ReviewIssue, ReviewReport } from "../types";

function hasCodeExample(content: string) {
  return (
    /```/.test(content) || /\bfunction\b|\bconst\b|\buseQuery\b/.test(content)
  );
}

function estimateScore(content: string, title: string) {
  const lengthScore = content.length > 1200 ? 8 : 6;
  const titleScore = title.length >= 20 && title.length <= 70 ? 8 : 6;
  const codeScore = hasCodeExample(content) ? 8 : 5;

  return {
    readability: lengthScore,
    technicalAccuracy: codeScore,
    completeness: Math.min(9, Math.round((lengthScore + codeScore) / 2)),
    seo: titleScore,
  };
}

export function mockReview(input: ReviewArticleRequest): ReviewReport {
  const score = estimateScore(input.content, input.title);
  const issues: ReviewIssue[] = [
    {
      severity: "medium" as const,
      category: "technical" as const,
      title: "Add more technical context",
      suggestion:
        "Before introducing the implementation, briefly explain the problem, why the pattern matters, and when readers should use it.",
    },
    {
      severity: "low" as const,
      category: "readability" as const,
      title: "Scan paragraph length",
      suggestion:
        "Review long paragraphs and split them when they contain multiple ideas, especially before or after code examples.",
    },
    {
      severity: hasCodeExample(input.content) ? "low" : "high",
      category: "code" as const,
      title: hasCodeExample(input.content)
        ? "Explain code examples"
        : "Add a code example",
      suggestion: hasCodeExample(input.content)
        ? "Make sure each code example has a short explanation of what changed and why it matters."
        : "Add at least one focused code example so readers can connect the explanation to implementation.",
    },
  ];

  return {
    summary:
      "Mock review completed. This report checks article structure, explanation quality, code examples, SEO basics, and missing content areas without editing the article.",
    overallScore:
      Math.round(
        ((score.readability +
          score.technicalAccuracy +
          score.completeness +
          score.seo) /
          4) *
          10,
      ) / 10,
    score,
    issues,
  };
}
