import "server-only";

import { getOpenAiModel, AiModelConfigurationError } from "@/features/ai/model";

export type ArticleReviewMode = "mock" | "remote";

export class ArticleReviewConfigurationError extends AiModelConfigurationError {
  constructor(message: string) {
    super(message);
    this.name = "ArticleReviewConfigurationError";
  }
}

export function getArticleReviewMode(): ArticleReviewMode {
  return process.env.AI_REVIEW_MODE === "remote" ? "remote" : "mock";
}

export function getArticleReviewModel() {
  try {
    return getOpenAiModel();
  } catch (error) {
    if (error instanceof AiModelConfigurationError) {
      throw new ArticleReviewConfigurationError(error.message);
    }

    throw error;
  }
}
