"use client";

import { useCallback } from "react";

import type { SeoSuggestion } from "../types";
import { AiSeoField } from "./AiSeoField";

const META_LABEL_STYLE = {
  color: "#cbd5e1",
  fontSize: 12,
  fontWeight: 700,
} as const;

const META_TEXT_STYLE = {
  color: "#f8fafc",
  fontSize: 13,
  lineHeight: 1.6,
} as const;

const META_BLOCK_STYLE = {
  display: "grid",
  gap: 6,
} as const;

type AiSeoPreviewProps = {
  value: SeoSuggestion;
  onChange: (value: SeoSuggestion) => void;
  onApply: () => void;
  onCancel: () => void;
  applyDisabled: boolean;
};

export function AiSeoPreview({
  value,
  onChange,
  onApply,
  onCancel,
  applyDisabled,
}: AiSeoPreviewProps) {
  const handleTitleChange = useCallback(
    (title: string) => onChange({ ...value, title }),
    [onChange, value],
  );

  const handleDescriptionChange = useCallback(
    (description: string) => onChange({ ...value, description }),
    [onChange, value],
  );

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        display: "grid",
        gap: 12,
        marginTop: 12,
        padding: 12,
      }}
    >
      <AiSeoField
        label="SEO title"
        maxLength={70}
        onChange={handleTitleChange}
        value={value.title}
      />
      <AiSeoField
        label="SEO description"
        maxLength={160}
        multiline
        onChange={handleDescriptionChange}
        value={value.description}
      />
      <div style={META_BLOCK_STYLE}>
        <strong style={META_LABEL_STYLE}>Keywords</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {value.keywords.map((keyword) => (
            <span
              key={keyword}
              style={{
                background: "#1f2937",
                border: "1px solid #475569",
                borderRadius: 6,
                color: "#f8fafc",
                fontSize: 12,
                lineHeight: 1.4,
                padding: "3px 7px",
              }}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
      <div style={META_BLOCK_STYLE}>
        <strong style={META_LABEL_STYLE}>Search intent</strong>
        <span style={META_TEXT_STYLE}>{value.searchIntent}</span>
      </div>
      <div style={META_BLOCK_STYLE}>
        <strong style={META_LABEL_STYLE}>Rationale</strong>
        <span style={META_TEXT_STYLE}>{value.rationale}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={applyDisabled} onClick={onApply} type="button">
          Apply title and description
        </button>
        <button onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}
