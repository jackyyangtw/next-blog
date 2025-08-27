// src/sanity/schemaTypes/authorType.ts
import { defineType, defineField } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "avatar", type: "image", options: { hotspot: true } }),
    defineField({ name: "email", type: "string" }), //（可選，用來和 NextAuth 對應）
  ],
});