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
import { buildPrompt, buildSystemPrompt } from "./prompt";

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
      system: buildSystemPrompt(input.locale),
      prompt: buildPrompt(input),
    });

    return reviewReportSchema.parse(result.output);
  } catch (error) {
    throw toArticleReviewError(error);
  }
}
