"use client";

import type { ChangeEvent } from "react";

type AiSeoFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  maxLength?: number;
};

export function AiSeoField({
  label,
  value,
  onChange,
  multiline = false,
  maxLength,
}: AiSeoFieldProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.currentTarget.value);
  };

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: "#4b5563", fontSize: 12, fontWeight: 600 }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          maxLength={maxLength}
          onChange={handleChange}
          rows={4}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: 6,
            font: "inherit",
            lineHeight: 1.5,
            padding: "8px 10px",
            resize: "vertical",
          }}
          value={value}
        />
      ) : (
        <input
          maxLength={maxLength}
          onChange={handleChange}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: 6,
            font: "inherit",
            padding: "8px 10px",
          }}
          type="text"
          value={value}
        />
      )}
      {maxLength ? (
        <span style={{ color: "#6b7280", fontSize: 12 }}>
          {value.length}/{maxLength}
        </span>
      ) : null}
    </label>
  );
}
