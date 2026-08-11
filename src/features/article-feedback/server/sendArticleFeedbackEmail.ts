import "server-only";

import nodemailer from "nodemailer";

import type { ArticleFeedbackInput } from "../schemas/articleFeedbackSchema";

const FEEDBACK_TYPE_LABELS = {
  helpful: "有幫助",
  notHelpful: "沒有幫助",
  suggestion: "建議",
} as const;

interface ArticleFeedbackEmailInput extends ArticleFeedbackInput {
  postTitle: string;
}

function getMailConfiguration() {
  const user = process.env.GMAIL_SMTP_USER;
  const pass = process.env.GMAIL_SMTP_APP_PASSWORD;
  const recipient = process.env.ARTICLE_FEEDBACK_RECIPIENT;

  if (!user || !pass || !recipient) {
    throw new Error("Article feedback email is not configured.");
  }

  return { pass, recipient, user };
}

export async function sendArticleFeedbackEmail({
  feedbackType,
  locale,
  message,
  postTitle,
}: ArticleFeedbackEmailInput) {
  const { pass, recipient, user } = getMailConfiguration();
  const feedbackTypeLabel = FEEDBACK_TYPE_LABELS[feedbackType];
  const transporter = nodemailer.createTransport({
    auth: { pass, user },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  });

  await transporter.sendMail({
    from: user,
    subject: `[文章回饋] ${postTitle}`,
    text: [
      `文章：${postTitle}`,
      `類型：${feedbackTypeLabel}`,
      `語系：${locale}`,
      "",
      "回饋內容：",
      message,
    ].join("\n"),
    to: recipient,
  });
}
