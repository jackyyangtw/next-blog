"use server";

import { createHash } from "node:crypto";

import { client } from "@/sanity/lib/client";

import { articleFeedbackFollowUpSchema } from "../schemas/articleFeedbackSchema";
import { checkArticleFeedbackRateLimit } from "../server/articleFeedbackRateLimit";
import { scheduleArticleFeedbackEmail } from "../server/scheduleArticleFeedbackEmail";

export interface SubmitArticleFeedbackFollowUpState {
  error?: string;
  success?: boolean;
}

const feedbackByIdQuery = /* groq */ `
  *[_type == "articleFeedback" && _id == $submissionId][0]{
    _id,
    _rev,
    feedbackType,
    followUpTokenHash,
    locale,
    "postTitle": post->title
  }
`;

interface StoredArticleFeedback {
  _id: string;
  _rev: string;
  feedbackType: "helpful" | "notHelpful" | "suggestion";
  followUpTokenHash?: string;
  locale: string;
  postTitle?: string;
}

export async function submitArticleFeedbackFollowUpAction(
  _: SubmitArticleFeedbackFollowUpState,
  formData: FormData,
): Promise<SubmitArticleFeedbackFollowUpState> {
  if (formData.get("website")) {
    return { success: true };
  }

  const parsed = articleFeedbackFollowUpSchema.safeParse({
    followUpToken: formData.get("followUpToken"),
    message: formData.get("message"),
    submissionId: formData.get("submissionId"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "補充資料格式不正確。" };
  }

  try {
    if (!(await checkArticleFeedbackRateLimit("followUp"))) {
      return { error: "操作太頻繁，請稍後再試。" };
    }
  } catch {
    return { error: "暫時無法送出補充意見，請再試一次。" };
  }

  const tokenHash = createHash("sha256")
    .update(parsed.data.followUpToken)
    .digest("hex");
  let feedback: StoredArticleFeedback | null = null;
  let saved = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      feedback = await client.fetch<StoredArticleFeedback | null>(
        feedbackByIdQuery,
        { submissionId: parsed.data.submissionId },
      );
    } catch {
      return { error: "暫時無法送出補充意見，請再試一次。" };
    }

    if (!feedback || feedback.followUpTokenHash !== tokenHash) {
      return { error: "這筆回饋已無法補充，請重新整理後再試一次。" };
    }

    try {
      await client
        .patch(feedback._id)
        .ifRevisionId(feedback._rev)
        .set({
          followUpEmailNotificationStatus: "pending",
          message: parsed.data.message,
        })
        .unset(["followUpEmailNotificationError", "followUpTokenHash"])
        .commit();
      saved = true;
      break;
    } catch {
      // The initial email status may have updated the document revision.
    }
  }

  if (!feedback || !saved) {
    return { error: "補充意見暫時無法儲存，請再試一次。" };
  }

  scheduleArticleFeedbackEmail(feedback._id, {
    feedbackType: feedback.feedbackType,
    isFollowUp: true,
    locale: feedback.locale,
    message: parsed.data.message,
    postTitle: feedback.postTitle ?? "這篇文章",
  });

  return { success: true };
}
