import type { StringInputProps } from "sanity";

import {
  POST_BANNER_PRESETS,
  getPostBannerPreset,
} from "@/sanity/constants/postBanners";

export function PresetBannerInput(props: StringInputProps) {
  const selectedPreset = getPostBannerPreset(props.value);

  return (
    <div>
      {props.renderDefault(props)}

      {selectedPreset ? (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              border: "1px solid var(--card-border-color)",
              borderRadius: 6,
              overflow: "hidden",
              background: "var(--card-bg-color)",
            }}
          >
            <div
              aria-label={selectedPreset.alt}
              role="img"
              style={{
                width: "100%",
                aspectRatio: "21 / 9",
                backgroundImage: `url(${selectedPreset.path})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div
              style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600 }}
            >
              {selectedPreset.title}
            </div>
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          marginTop: 12,
        }}
      >
        {POST_BANNER_PRESETS.map((preset) => {
          const isSelected = preset.value === props.value;

          return (
            <div
              key={preset.value}
              style={{
                border: isSelected
                  ? "2px solid var(--card-focus-ring-color)"
                  : "1px solid var(--card-border-color)",
                borderRadius: 6,
                overflow: "hidden",
                background: "var(--card-bg-color)",
              }}
            >
              <div
                aria-label={preset.alt}
                role="img"
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  backgroundImage: `url(${preset.path})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div style={{ padding: "8px", fontSize: 12 }}>{preset.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
