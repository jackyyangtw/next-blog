import { randomUUID } from "node:crypto";

const PRIVATE_FEEDBACK_PREFIX = "articleFeedback.";

export function createPrivateArticleFeedbackId(): string {
  return `${PRIVATE_FEEDBACK_PREFIX}${randomUUID()}`;
}
