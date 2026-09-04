"use server";

import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { providerErrorMessage } from "@/features/ai/errors/providerErrorMessage";
import { authOptions } from "@/lib/auth/auth";
import {
  ARTICLE_REVIEW_CONTENT_MAX_LENGTH,
  reviewArticleRequestSchema,
} from "../schemas/reviewArticleRequestSchema";
import { reviewArticle, ArticleReviewError } from "../server/reviewArticle";
import type { ReviewArticleActionResult } from "../types";

function inputErrorMessage(error: ZodError) {
  return error.issues[0]?.message || "Article review input is invalid.";
}

function reviewErrorMessage(error: ArticleReviewError) {
  return providerErrorMessage(error.code, {
    featureName: "AI Reviewer",
    invalidOutputMessage: "AI 回傳格式不符合文章審查規格，請重新審查一次。",
    failureMessage: "目前無法審查文章，請稍後再試。",
  });
}

export async function reviewArticleAction(
  input: unknown,
): Promise<ReviewArticleActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Please sign in before reviewing an article.",
      },
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "You do not have permission to review articles.",
      },
    };
  }

  const parsed = reviewArticleRequestSchema.safeParse(input);

  if (!parsed.success) {
    const isContentTooLarge = parsed.error.issues.some(
      (issue) =>
        issue.path[0] === "content" &&
        issue.code === "too_big" &&
        issue.maximum === ARTICLE_REVIEW_CONTENT_MAX_LENGTH,
    );

    return {
      success: false,
      error: {
        code: isContentTooLarge ? "CONTENT_TOO_LARGE" : "INVALID_INPUT",
        message: inputErrorMessage(parsed.error),
      },
    };
  }

  try {
    return {
      success: true,
      data: await reviewArticle(parsed.data),
    };
  } catch (error) {
    const mappedError =
      error instanceof ArticleReviewError
        ? error
        : new ArticleReviewError("PROVIDER_FAILURE");

    return {
      success: false,
      error: {
        code: "ARTICLE_REVIEW_FAILED",
        message: reviewErrorMessage(mappedError),
      },
    };
  }
}
