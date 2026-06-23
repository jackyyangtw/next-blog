export const POST_BANNER_SOURCE = {
  upload: "upload",
  preset: "preset",
} as const;

export type PostBannerSource =
  (typeof POST_BANNER_SOURCE)[keyof typeof POST_BANNER_SOURCE];

export const POST_BANNER_PRESETS = [
  {
    title: "Code Wave",
    value: "code-wave",
    path: "/images/banners/code-wave.svg",
    alt: "Abstract code wave banner",
  },
  {
    title: "Product Grid",
    value: "product-grid",
    path: "/images/banners/product-grid.svg",
    alt: "Structured product grid banner",
  },
  {
    title: "Content Flow",
    value: "content-flow",
    path: "/images/banners/content-flow.svg",
    alt: "Layered content flow banner",
  },
  {
    title: "AI Topics",
    value: "ai-topics",
    path: "/images/banners/ai-topics.svg",
    alt: "Abstract AI topics banner",
  },
  {
    title: "Testing Flow",
    value: "testing-flow",
    path: "/images/banners/testing-flow.svg",
    alt: "Abstract testing flow banner",
  },
] as const;

export type PostBannerPresetValue =
  (typeof POST_BANNER_PRESETS)[number]["value"];

export function getPostBannerPreset(value?: string | null) {
  return POST_BANNER_PRESETS.find((preset) => preset.value === value);
}
