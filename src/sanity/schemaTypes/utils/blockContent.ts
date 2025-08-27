import { defineType, defineArrayMember } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Content",
  type: "array",
  of: [
    // 文字區塊（可選樣式/標題/清單/標註）
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              { name: "href", type: "url", title: "URL" },
              { name: "newTab", type: "boolean", title: "Open in new tab" },
            ],
          },
        ],
      },
    }),
    // 圖片區塊
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
        { name: "caption", type: "string", title: "Caption" },
      ],
    }),
    // 程式碼區塊（可選，需安裝額外套件）
    defineArrayMember({
      type: "code",
      options: {
        theme: "dark",
        languageAlternatives: [
          { title: "TypeScript", value: "tsx" },
          { title: "JavaScript", value: "jsx" },
        ],
      },
    }),
  ],
});
