"use server";

import { client } from "@/sanity/lib/client";

import { articleFeedbackSchema } from "../schemas/articleFeedbackSchema";
import { sendArticleFeedbackEmail } from "../server/sendArticleFeedbackEmail";

export interface SubmitArticleFeedbackState {
  error?: string;
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

  if (parsed.data.website) {
    return { success: true, submissionId: crypto.randomUUID() };
  }

  const post = await client.fetch<{ _id: string; title: string } | null>(
    postByIdQuery,
    { postId: parsed.data.postId },
  );

  if (!post) {
    return { error: "找不到這篇文章，請重新整理後再試一次。" };
  }

  const feedback = await client.create({
    _type: "articleFeedback",
    emailNotificationStatus: "pending",
    feedbackType: parsed.data.feedbackType,
    locale: parsed.data.locale,
    message: parsed.data.message,
    post: { _ref: post._id, _type: "reference", _weak: true },
  });

  try {
    await sendArticleFeedbackEmail({ ...parsed.data, postTitle: post.title });
    await client
      .patch(feedback._id)
      .set({ emailNotificationStatus: "sent" })
      .commit();
  } catch (error) {
    console.error("[article feedback] email notification failed", error);
    await client
      .patch(feedback._id)
      .set({
        emailNotificationError: "SMTP delivery failed. Check server logs.",
        emailNotificationStatus: "failed",
      })
      .commit();
  }

  return { success: true, submissionId: feedback._id };
}
