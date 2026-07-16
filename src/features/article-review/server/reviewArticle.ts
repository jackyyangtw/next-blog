import "server-only";

import {
  APICallError,
  LoadAPIKeyError,
  NoObjectGeneratedError,
  Output,
  generateText,
} from "ai";

import type { AiProviderErrorCode } from "@/features/ai/errors/providerErrorMessage";
import type { ReviewArticleRequest, ReviewReport } from "../types";
import { reviewReportSchema } from "../schemas/reviewReportSchema";
import {
  ArticleReviewConfigurationError,
  getArticleReviewMode,
  getArticleReviewModel,
} from "./model";
import { mockReview } from "./mockReview";

const ARTICLE_REVIEW_TIMEOUT_MS = 90_000;

export type ArticleReviewErrorCode = AiProviderErrorCode;

export class ArticleReviewError extends Error {
  constructor(
    readonly code: ArticleReviewErrorCode,
    message = "Article review failed.",
  ) {
    super(message);
    this.name = "ArticleReviewError";
  }
}

function buildPrompt(input: ReviewArticleRequest) {
  const libraries =
    input.technicalContext?.libraries
      ?.map(
        ({ name, version }) =>
          `${name}${version ? `: ${version}` : ": version unspecified"}`,
      )
      .join("\n") || "(none provided)";

  return [
    `Locale: ${input.locale}`,
    `Title: ${input.title || "(empty)"}`,
    `Description: ${input.description || "(empty)"}`,
    `Categories: ${input.categories.join(", ") || "(none)"}`,
    "Technical context:",
    libraries,
    "Article content:",
    input.content,
  ].join("\n\n");
}
function getApiCallError(error: unknown) {
  if (APICallError.isInstance(error)) {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const cause = "cause" in error ? error.cause : undefined;
    if (APICallError.isInstance(cause)) {
      return cause;
    }

    const errors = "errors" in error ? error.errors : undefined;
    if (Array.isArray(errors)) {
      return errors.find((item) => APICallError.isInstance(item));
    }
  }
}

function isQuotaExceeded(error: APICallError) {
  return /quota|billing|insufficient/i.test(error.message);
}

function getErrorName(error: unknown) {
  return error instanceof Error ? error.name : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "";
}

function isTimeoutLikeError(error: unknown): boolean {
  const name = getErrorName(error);
  const message = getErrorMessage(error);

  if (/abort|timeout/i.test(name) || /abort|timeout|timed out/i.test(message)) {
    return true;
  }

  if (typeof error === "object" && error !== null) {
    const cause = "cause" in error ? error.cause : undefined;
    if (cause && isTimeoutLikeError(cause)) {
      return true;
    }

    const errors = "errors" in error ? error.errors : undefined;
    if (Array.isArray(errors)) {
      return errors.some((item) => isTimeoutLikeError(item));
    }
  }

  return false;
}

function toArticleReviewError(error: unknown): ArticleReviewError {
  if (
    error instanceof ArticleReviewConfigurationError ||
    LoadAPIKeyError.isInstance(error)
  ) {
    return new ArticleReviewError("MISSING_API_KEY");
  }

  if (NoObjectGeneratedError.isInstance(error)) {
    return new ArticleReviewError("INVALID_STRUCTURED_OUTPUT");
  }

  if (isTimeoutLikeError(error)) {
    return new ArticleReviewError("PROVIDER_TIMEOUT");
  }

  const apiError = getApiCallError(error);
  if (apiError) {
    if (apiError.statusCode === 429) {
      return new ArticleReviewError(
        isQuotaExceeded(apiError)
          ? "PROVIDER_QUOTA_EXCEEDED"
          : "PROVIDER_RATE_LIMIT",
      );
    }
    if (apiError.statusCode === 408 || apiError.statusCode === 504) {
      return new ArticleReviewError("PROVIDER_TIMEOUT");
    }
  }

  return new ArticleReviewError("PROVIDER_FAILURE");
}

export async function reviewArticle(
  input: ReviewArticleRequest,
): Promise<ReviewReport> {
  if (getArticleReviewMode() === "mock") {
    return mockReview(input);
  }

  try {
    const result = await generateText({
      model: getArticleReviewModel(),
      output: Output.object({
        name: "ReviewReport",
        description: "A pre-publication technical article review report.",
        schema: reviewReportSchema,
      }),
      maxRetries: 0,
      timeout: ARTICLE_REVIEW_TIMEOUT_MS,
      system: [
        "You are a senior technical editor reviewing a draft technical article before publication.",

        "Prioritize technical correctness over the number of issues found.",
        "Do not invent issues merely to make the report more comprehensive.",

        "Review each technical claim using the full surrounding context.",
        "When reviewing boolean expressions or code conditions, evaluate the entire expression rather than isolated variables.",

        "Distinguish clearly between:",
        "1. factual or technical errors,",
        "2. potentially misleading explanations,",
        "3. optional readability improvements.",

        "Do not describe an optional simplification as a correctness bug.",

        "Infer library or framework versions only when the article provides strong evidence.",
        "If the version materially affects correctness and is not explicitly stated, report the missing version as the issue instead of assuming a version.",

        "Do not mix APIs or terminology from different major versions.",
        "When uncertain about a technical claim, lower the confidence or omit the issue.",

        "Return only high-confidence, actionable issues.",
        "Prefer fewer accurate issues over many speculative issues.",

        "Evaluate technical correctness first, then readability, code examples, missing context, and SEO.",
        "SEO suggestions must not outweigh or distract from technical review.",

        "Only provide review suggestions. Do not rewrite the article and do not generate patches.",
        "Scores must be numbers from 0 to 10.",
        "Issues should be concise and explain why the issue matters.",

        input.locale === "zh-TW"
          ? "Write the report in Traditional Chinese using terminology common in Taiwan."
          : "Write the report in English.",
      ].join(" "),
      prompt: buildPrompt(input),
    });

    return reviewReportSchema.parse(result.output);
  } catch (error) {
    throw toArticleReviewError(error);
  }
}
