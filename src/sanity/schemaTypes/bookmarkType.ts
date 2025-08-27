import { defineType, defineField } from "sanity";

export const bookmarkType = defineType({
  name: "bookmark",
  title: "Bookmark",
  type: "document",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "標籤",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "note", title: "備註", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "post.title", subtitle: "user.name" },
  },
});