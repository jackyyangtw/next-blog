import { expect, test } from "vitest";

import {
  articleFeedbackFollowUpSchema,
  articleFeedbackSchema,
} from "./articleFeedbackSchema";

const baseFeedback = {
  locale: "zh-TW",
  postId: "post-1",
  website: "",
};

test.each(["helpful", "notHelpful"] as const)(
  "選擇 %s 時不填意見也能記錄評價",
  (feedbackType) => {
    const result = articleFeedbackSchema.safeParse({
      ...baseFeedback,
      feedbackType,
      message: "",
    });

    expect(result.success).toBe(true);
  },
);

test("投票不能夾帶意見內容或使用已移除的建議類型", () => {
  expect(
    articleFeedbackSchema.safeParse({
      ...baseFeedback,
      feedbackType: "helpful",
      message: "替我寄這段內容",
    }).success,
  ).toBe(false);
  expect(
    articleFeedbackSchema.safeParse({
      ...baseFeedback,
      feedbackType: "suggestion",
      message: "替我寄這段內容",
    }).success,
  ).toBe(false);
});

test("補充意見必須有內容才能送出", () => {
  const result = articleFeedbackFollowUpSchema.safeParse({
    followUpToken: "a".repeat(64),
    message: "   ",
    submissionId: "feedback-1",
    website: "",
  });

  expect(result.success).toBe(false);
});

test("有效補充意見可帶著回饋識別資料送出", () => {
  const result = articleFeedbackFollowUpSchema.safeParse({
    followUpToken: "a".repeat(64),
    message: "  可以增加範例  ",
    submissionId: "feedback-1",
    website: "",
  });

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.message).toBe("可以增加範例");
  }
});
