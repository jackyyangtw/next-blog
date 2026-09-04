import type { GenerateSeoRequest } from "../schemas/generateSeoRequestSchema";
import type { SeoSuggestion } from "../schemas/seoSuggestionSchema";

export type { GenerateSeoRequest, SeoSuggestion };

export type GenerateSeoActionErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "CONTENT_TOO_LARGE"
  | "AI_SEO_GENERATION_FAILED";

export type GenerateSeoActionResult =
  | {
      success: true;
      data: SeoSuggestion;
    }
  | {
      success: false;
      error: {
        code: GenerateSeoActionErrorCode;
        message: string;
      };
    };
