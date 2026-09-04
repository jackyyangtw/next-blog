"use client";

import type { ReviewIssue } from "../types";

const SEVERITY_COLORS = {
  high: {
    border: "#ef4444",
    background: "#450a0a",
    text: "#fecaca",
  },
  medium: {
    border: "#f59e0b",
    background: "#451a03",
    text: "#fde68a",
  },
  low: {
    border: "#22c55e",
    background: "#052e16",
    text: "#bbf7d0",
  },
} as const;

type ReviewIssueCardProps = {
  issue: ReviewIssue;
};

export function ReviewIssueCard({ issue }: ReviewIssueCardProps) {
  const color = SEVERITY_COLORS[issue.severity];

  return (
    <article
      style={{
        border: `1px solid ${color.border}`,
        borderRadius: 8,
        display: "grid",
        gap: 8,
        padding: 10,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <span
          style={{
            background: color.background,
            border: `1px solid ${color.border}`,
            borderRadius: 999,
            color: color.text,
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 7px",
            textTransform: "uppercase",
          }}
        >
          {issue.severity}
        </span>
        <span style={{ color: "#cbd5e1", fontSize: 12 }}>{issue.category}</span>
      </div>
      <strong style={{ color: "#f8fafc", fontSize: 14 }}>{issue.title}</strong>
      <p style={{ color: "#e5e7eb", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        {issue.suggestion}
      </p>
    </article>
  );
}
