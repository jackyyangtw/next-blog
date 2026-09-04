"use client";

import type { ReviewReport as ReviewReportType } from "../types";
import { ReviewIssueCard } from "./ReviewIssueCard";

const SCORE_LABELS = [
  ["Readability", "readability"],
  ["Technical", "technicalAccuracy"],
  ["Completeness", "completeness"],
  ["SEO", "seo"],
] as const;

type ReviewReportProps = {
  report: ReviewReportType;
};

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div
        style={{
          alignItems: "center",
          color: "#e5e7eb",
          display: "flex",
          fontSize: 12,
          justifyContent: "space-between",
        }}
      >
        <span>{label}</span>
        <strong>{value.toFixed(1)}</strong>
      </div>
      <div
        style={{
          background: "#1f2937",
          borderRadius: 999,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "#38bdf8",
            height: "100%",
            width: `${Math.max(0, Math.min(10, value)) * 10}%`,
          }}
        />
      </div>
    </div>
  );
}

export function ReviewReport({ report }: ReviewReportProps) {
  return (
    <section
      style={{
        border: "1px solid #475569",
        borderRadius: 8,
        display: "grid",
        gap: 14,
        marginTop: 12,
        padding: 12,
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
          Overall Score
        </span>
        <strong style={{ color: "#f8fafc", fontSize: 28 }}>
          {report.overallScore.toFixed(1)} / 10
        </strong>
        <p
          style={{ color: "#e5e7eb", fontSize: 13, lineHeight: 1.6, margin: 0 }}
        >
          {report.summary}
        </p>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {SCORE_LABELS.map(([label, key]) => (
          <ScoreRow key={key} label={label} value={report.score[key]} />
        ))}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
          Issues
        </span>
        {report.issues.length > 0 ? (
          report.issues.map((issue) => (
            <ReviewIssueCard
              key={`${issue.severity}-${issue.category}-${issue.title}`}
              issue={issue}
            />
          ))
        ) : (
          <p style={{ color: "#e5e7eb", fontSize: 13, margin: 0 }}>
            No major issues found.
          </p>
        )}
      </div>
    </section>
  );
}
