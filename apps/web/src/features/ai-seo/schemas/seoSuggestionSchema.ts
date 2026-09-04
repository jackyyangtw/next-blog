import { z } from "zod";

export const seoSuggestionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "SEO title should be at least 10 characters.")
    .max(70, "SEO title should be 70 characters or fewer.")
    .describe("A concise SEO title. Do not include a slug."),
  description: z
    .string()
    .trim()
    .min(50, "SEO description should be at least 50 characters.")
    .max(160, "SEO description should be 160 characters or fewer.")
    .describe("A search result meta description for the article."),
  keywords: z
    .array(z.string().trim().min(2).max(40))
    .min(3)
    .max(8)
    .describe("Human-review keywords. These are suggestions only."),
  searchIntent: z
    .string()
    .trim()
    .min(8)
    .max(120)
    .describe("The likely reader intent this article should satisfy."),
  rationale: z
    .string()
    .trim()
    .min(20)
    .max(280)
    .describe("Brief explanation for editors reviewing the suggestion."),
});

export type SeoSuggestion = z.infer<typeof seoSuggestionSchema>;
