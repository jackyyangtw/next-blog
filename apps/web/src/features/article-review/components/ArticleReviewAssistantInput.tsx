"use client";

import { useCallback, useMemo, useState } from "react";
import { useFormValue } from "sanity";

import { portableTextToPlainText } from "@/sanity/portableTextToPlainText";
import type { ReviewReport as ReviewReportType } from "../types";
import { useReviewArticle } from "../hooks/useReviewArticle";
import { ReviewReport } from "./ReviewReport";

type PostStudioDocument = {
  title?: string;
  description?: string;
  content?: unknown;
  categories?: {
    title?: string;
  }[];
};

function getCategoryLabels(categories: PostStudioDocument["categories"]) {
  return (categories ?? [])
    .map((category) => category.title)
    .filter((category): category is string => Boolean(category));
}

export function ArticleReviewAssistantInput() {
  const document = useFormValue([]) as PostStudioDocument | undefined;
  const reviewArticleMutation = useReviewArticle();
  const [report, setReport] = useState<ReviewReportType | null>(null);
  const [message, setMessage] = useState("");

  const content = useMemo(
    () => portableTextToPlainText(document?.content),
    [document?.content],
  );
  const categories = useMemo(
    () => getCategoryLabels(document?.categories),
    [document?.categories],
  );
  const isReviewing = reviewArticleMutation.isPending;

  const handleReview = useCallback(async () => {
    setMessage("");

    const result = await reviewArticleMutation.mutateAsync({
      title: document?.title ?? "",
      description: document?.description ?? "",
      content,
      locale: "zh-TW",
      categories,
    });

    if (!result.success) {
      setMessage(result.error.message);
      return;
    }

    setReport(result.data);
  }, [
    categories,
    content,
    document?.description,
    document?.title,
    reviewArticleMutation,
  ]);

  const handleClear = useCallback(() => {
    setReport(null);
    setMessage("");
  }, []);

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        display: "grid",
        gap: 10,
        padding: 12,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={isReviewing || content.length < 80}
          onClick={handleReview}
          type="button"
        >
          {isReviewing ? "Reviewing..." : "Review Article"}
        </button>
        {report ? (
          <button onClick={handleClear} type="button">
            Clear
          </button>
        ) : null}
      </div>
      {message ? (
        <div style={{ color: "#e5e7eb", fontSize: 13 }}>{message}</div>
      ) : null}
      {report ? <ReviewReport report={report} /> : null}
    </div>
  );
}
