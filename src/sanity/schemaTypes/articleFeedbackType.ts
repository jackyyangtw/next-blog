import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import { defineField, defineType } from "sanity";

export const articleFeedbackType = defineType({
  name: "articleFeedback",
  title: "Article Feedback",
  type: "document",
  icon: FeedbackOutlinedIcon,
  fields: [
    defineField({
      name: "post",
      title: "Article",
      type: "reference",
      to: [{ type: "post" }],
      weak: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "feedbackType",
      title: "Feedback type",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Helpful", value: "helpful" },
          { title: "Not helpful", value: "notHelpful" },
          { title: "Suggestion", value: "suggestion" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emailNotificationStatus",
      title: "Email notification status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Sent", value: "sent" },
          { title: "Failed", value: "failed" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emailNotificationError",
      title: "Email notification error",
      type: "text",
      readOnly: true,
      hidden: ({ value }) => !value,
    }),
  ],
  preview: {
    select: {
      title: "post.title",
      subtitle: "feedbackType",
    },
  },
});
