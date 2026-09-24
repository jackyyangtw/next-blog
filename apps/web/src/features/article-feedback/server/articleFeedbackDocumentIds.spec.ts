import { expect, test } from "vitest";

import { createPrivateArticleFeedbackId } from "./articleFeedbackDocumentIds";

test("新回饋的 Sanity ID 使用限制匿名讀取的子路徑", () => {
  const id = createPrivateArticleFeedbackId();

  expect(id).toMatch(/^articleFeedback\.[a-f0-9-]{36}$/);
  expect(id.length).toBeLessThanOrEqual(128);
});
