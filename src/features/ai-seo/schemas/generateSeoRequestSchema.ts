import { z } from "zod";

export const SUPPORTED_AI_SEO_LOCALES = ["zh-TW", "en"] as const;

export const AI_SEO_CONTENT_MAX_LENGTH = 20_000;

export const generateSeoRequestSchema = z.object({
  title: z.string().trim().max(120).default(""),
  description: z.string().trim().max(240).default(""),
  content: z
    .string()
    .trim()
    .min(40, "Article content is required before generating SEO.")
    .max(AI_SEO_CONTENT_MAX_LENGTH, "Article content is too large."),
  locale: z.enum(SUPPORTED_AI_SEO_LOCALES).default("zh-TW"),
  categories: z.array(z.string().trim().min(1).max(80)).max(10).default([]),
});

export type GenerateSeoRequest = z.infer<typeof generateSeoRequestSchema>;
