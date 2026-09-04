// src/sanity/schemaTypes/postType.ts
import { defineField, defineType } from "sanity";
import {
  POST_BANNER_PRESETS,
  POST_BANNER_SOURCE,
} from "@/sanity/constants/postBanners";
import { ArticleReviewAssistantInput } from "@/features/article-review/components/ArticleReviewAssistantInput";
import { AiSeoAssistantInput } from "@/features/ai-seo/components/AiSeoAssistantInput";
import { PostSlugInput } from "./components/PostSlugInput";
import { PresetBannerInput } from "./components/PresetBannerInput";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (r) => r.required().min(1), // è‡³å°‘è¦é¸ä¸€å€‹
    }),
    defineField({
      name: "bannerSource",
      title: "Banner source",
      type: "string",
      initialValue: POST_BANNER_SOURCE.upload,
      options: {
        layout: "radio",
        list: [
          { title: "Upload image", value: POST_BANNER_SOURCE.upload },
          { title: "Use preset banner", value: POST_BANNER_SOURCE.preset },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "presetBanner",
      title: "Preset banner",
      type: "string",
      hidden: ({ parent }) =>
        parent?.bannerSource !== POST_BANNER_SOURCE.preset,
      options: {
        list: POST_BANNER_PRESETS.map((preset) => ({
          title: preset.title,
          value: preset.value,
        })),
      },
      components: {
        input: PresetBannerInput,
      },
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as
            | { bannerSource?: string }
            | undefined;
          if (parent?.bannerSource !== POST_BANNER_SOURCE.preset) {
            return true;
          }
          return value ? true : "Choose a preset banner.";
        }),
    }),
    defineField({
      name: "photo",
      title: "Uploaded banner image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) =>
        parent?.bannerSource === POST_BANNER_SOURCE.preset,
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as
            | { bannerSource?: string }
            | undefined;
          if (parent?.bannerSource === POST_BANNER_SOURCE.preset) {
            return true;
          }
          return value
            ? true
            : "Upload a banner image or choose a preset banner.";
        }),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      components: {
        input: PostSlugInput,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      type: "blockContent",
      validation: (r) => r.required(),
    }), // â† å¯Œæ–‡æœ¬
    defineField({
      name: "aiSeoAssistant",
      title: "AI SEO Assistant",
      type: "string",
      readOnly: true,
      components: {
        input: AiSeoAssistantInput,
      },
    }),
    defineField({
      name: "articleReviewAssistant",
      title: "Technical Article Reviewer",
      type: "string",
      readOnly: true,
      components: {
        input: ArticleReviewAssistantInput,
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (r) => r.required(),
    }),
  ],
});
