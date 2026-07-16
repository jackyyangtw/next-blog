import type { ReviewArticleRequest } from "./schemas/reviewArticleRequestSchema";
import type { ReviewIssue, ReviewReport } from "./schemas/reviewReportSchema";

export type { ReviewArticleRequest, ReviewIssue, ReviewReport };

export type ReviewArticleActionErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "CONTENT_TOO_LARGE"
  | "ARTICLE_REVIEW_FAILED";

export type ReviewArticleActionResult =
  | {
      success: true;
      data: ReviewReport;
    }
  | {
      success: false;
      error: {
        code: ReviewArticleActionErrorCode;
        message: string;
      };
    };
