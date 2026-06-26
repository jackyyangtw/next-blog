import { defineType, defineField, defineArrayMember } from "sanity";
import { BlockContentInput } from "./components/BlockContentInput";
import { QuoteStyle } from "./components/QuoteStyle";

export const blockContent = defineType({
  name: "blockContent",
  title: "Content",
  type: "array",
  components: {
    input: BlockContentInput,
  },
  of: [
    // 文字區塊（可選樣式/標題/清單/標註）
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote", component: QuoteStyle },
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
    defineArrayMember({
      name: "divider",
      title: "Divider",
      type: "object",
      fields: [],
      preview: {
        prepare() {
          return {
            title: "Divider",
          };
        },
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
    // 表格區塊
    defineArrayMember({
      name: "table",
      title: "Table",
      type: "object",
      fields: [
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
        defineField({
          name: "hasHeaderRow",
          title: "Use first row as header",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              name: "tableRow",
              title: "Row",
              type: "object",
              fields: [
                defineField({
                  name: "cells",
                  title: "Cells",
                  type: "array",
                  of: [
                    defineArrayMember({
                      name: "tableCell",
                      title: "Cell",
                      type: "object",
                      fields: [
                        defineField({
                          name: "text",
                          title: "Text",
                          type: "text",
                          rows: 2,
                        }),
                      ],
                      preview: {
                        select: {
                          title: "text",
                        },
                        prepare({ title }) {
                          return {
                            title: title || "Empty cell",
                          };
                        },
                      },
                    }),
                  ],
                }),
              ],
              preview: {
                select: {
                  cells: "cells",
                },
                prepare({ cells }) {
                  const cellCount = Array.isArray(cells) ? cells.length : 0;

                  return {
                    title: `Row (${cellCount} cell${cellCount === 1 ? "" : "s"})`,
                  };
                },
              },
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
      preview: {
        select: {
          caption: "caption",
          rows: "rows",
        },
        prepare({ caption, rows }) {
          const rowCount = Array.isArray(rows) ? rows.length : 0;

          return {
            title: caption || "Table",
            subtitle: `${rowCount} row${rowCount === 1 ? "" : "s"}`,
          };
        },
      },
    }),
  ],
});
