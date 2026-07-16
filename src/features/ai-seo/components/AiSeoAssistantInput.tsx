"use client";

import { useCallback, useMemo, useState } from "react";
import { useDocumentOperation, useFormValue } from "sanity";

import type { SeoSuggestion } from "../types";
import { useGenerateSeo } from "../hooks/useGenerateSeo";
import { AiSeoPreview } from "./AiSeoPreview";
import { portableTextToPlainText } from "./portableTextToPlainText";

type PostStudioDocument = {
  _id?: string;
  _type?: string;
  title?: string;
  description?: string;
  content?: unknown;
  categories?: {
    _ref?: string;
    title?: string;
  }[];
};

function getPublishedId(documentId: string | undefined) {
  return documentId?.replace(/^drafts\./, "") ?? "";
}

function getCategoryLabels(categories: PostStudioDocument["categories"]) {
  return (categories ?? [])
    .map((category) => category.title)
    .filter((category): category is string => Boolean(category));
}

export function AiSeoAssistantInput() {
  const document = useFormValue([]) as PostStudioDocument | undefined;
  const documentId = getPublishedId(document?._id);
  const operations = useDocumentOperation(
    documentId || "__missing_post_id__",
    "post",
  );
  const generateSeoMutation = useGenerateSeo();
  const [suggestion, setSuggestion] = useState<SeoSuggestion | null>(null);
  const [message, setMessage] = useState("");

  const content = useMemo(
    () => portableTextToPlainText(document?.content),
    [document?.content],
  );
  const categories = useMemo(
    () => getCategoryLabels(document?.categories),
    [document?.categories],
  );
  const canApply = Boolean(
    documentId && suggestion && !operations.patch.disabled,
  );
  const isGenerating = generateSeoMutation.isPending;

  const handleGenerate = useCallback(async () => {
    setMessage("");

    const result = await generateSeoMutation.mutateAsync({
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

    setSuggestion(result.data);
  }, [
    categories,
    content,
    document?.description,
    document?.title,
    generateSeoMutation,
  ]);

  const handleApply = useCallback(() => {
    if (!suggestion || operations.patch.disabled) {
      return;
    }

    operations.patch.execute([
      {
        set: {
          title: suggestion.title,
          description: suggestion.description,
        },
      },
    ]);
    setMessage("Applied to the form. Review it before saving or publishing.");
  }, [operations.patch, suggestion]);

  const handleCancel = useCallback(() => {
    setSuggestion(null);
    setMessage("");
  }, []);

  return (
    <div style={{ display: "grid", gap: 10 }}>
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
            disabled={isGenerating || content.length < 40}
            onClick={handleGenerate}
            type="button"
          >
            {isGenerating ? "Generating..." : "Generate SEO"}
          </button>
          {suggestion ? (
            <button onClick={handleGenerate} type="button">
              Regenerate
            </button>
          ) : null}
        </div>
        {message ? (
          <div style={{ color: "#374151", fontSize: 13 }}>{message}</div>
        ) : null}
        {suggestion ? (
          <AiSeoPreview
            applyDisabled={!canApply}
            onApply={handleApply}
            onCancel={handleCancel}
            onChange={setSuggestion}
            value={suggestion}
          />
        ) : null}
      </div>
    </div>
  );
}
