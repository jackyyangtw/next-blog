"use server";

import { createHash, randomBytes } from "node:crypto";

import { client } from "@/sanity/lib/client";

import { articleFeedbackSchema } from "../schemas/articleFeedbackSchema";
import { createPrivateArticleFeedbackId } from "../server/articleFeedbackDocumentIds";
import { checkArticleFeedbackRateLimit } from "../server/articleFeedbackRateLimit";
import { scheduleArticleFeedbackEmail } from "../server/scheduleArticleFeedbackEmail";

export interface SubmitArticleFeedbackState {
  error?: string;
  followUpToken?: string;
  submissionId?: string;
  success?: boolean;
}

const postByIdQuery = /* groq */ `
  *[_type == "post" && _id == $postId][0]{ _id, title }
`;

export async function submitArticleFeedbackAction(
  _: SubmitArticleFeedbackState,
  formData: FormData,
): Promise<SubmitArticleFeedbackState> {
  if (formData.get("website")) {
    return { success: true, submissionId: crypto.randomUUID() };
  }

  const parsed = articleFeedbackSchema.safeParse({
    feedbackType: formData.get("feedbackType"),
    locale: formData.get("locale"),
    message: formData.get("message"),
    postId: formData.get("postId"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "回饋資料格式不正確。" };
  }

  try {
    if (!(await checkArticleFeedbackRateLimit("vote", parsed.data.postId))) {
      return { error: "操作太頻繁，請稍後再試。" };
    }
  } catch {
    return { error: "暫時無法送出評價，請再試一次。" };
  }

  let post: { _id: string; title: string } | null;
  try {
    post = await client.fetch<{ _id: string; title: string } | null>(
      postByIdQuery,
      { postId: parsed.data.postId },
    );
  } catch {
    return { error: "暫時無法送出評價，請再試一次。" };
  }

  if (!post) {
    return { error: "找不到這篇文章，請重新整理後再試一次。" };
  }

  const followUpToken = randomBytes(32).toString("hex");
  let feedback: { _id: string };
  try {
    feedback = await client.create({
      // Sanity sub-path IDs require authenticated reads, even in a public dataset.
      _id: createPrivateArticleFeedbackId(),
      _type: "articleFeedback",
      emailNotificationStatus: "pending",
      feedbackType: parsed.data.feedbackType,
      followUpTokenHash: createHash("sha256")
        .update(followUpToken)
        .digest("hex"),
      locale: parsed.data.locale,
      message: parsed.data.message,
      post: { _ref: post._id, _type: "reference", _weak: true },
    });
  } catch {
    return { error: "暫時無法送出評價，請再試一次。" };
  }

  scheduleArticleFeedbackEmail(feedback._id, {
    ...parsed.data,
    postTitle: post.title,
  });

  return { followUpToken, success: true, submissionId: feedback._id };
}
