import "server-only";

import { after } from "next/server";

import { client } from "@/sanity/lib/client";

import { sendArticleFeedbackEmail } from "./sendArticleFeedbackEmail";

type ArticleFeedbackEmailInput = Parameters<typeof sendArticleFeedbackEmail>[0];

export function scheduleArticleFeedbackEmail(
  feedbackId: string,
  email: ArticleFeedbackEmailInput,
) {
  after(async () => {
    let emailSent = false;
    try {
      await sendArticleFeedbackEmail(email);
      emailSent = true;
    } catch (error) {
      console.error("[article feedback] email notification failed", error);
    }

    const status = emailSent ? "sent" : "failed";
    const errorMessage = "SMTP delivery failed. Check server logs.";
    const statusFields = email.isFollowUp
      ? {
          followUpEmailNotificationStatus: status,
          ...(!emailSent && { followUpEmailNotificationError: errorMessage }),
        }
      : {
          emailNotificationStatus: status,
          ...(!emailSent && { emailNotificationError: errorMessage }),
        };

    try {
      await client.patch(feedbackId).set(statusFields).commit();
    } catch (error) {
      console.error("[article feedback] email status update failed", error);
    }
  });
}
