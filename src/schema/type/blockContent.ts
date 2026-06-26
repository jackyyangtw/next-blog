import { z } from "zod";

// 1. 文字區塊
export const BlockTextSchema = z.object({
  _type: z.literal("block"),
  _key: z.string(),
  style: z.string().optional(),
  children: z.array(
    z.object({
      _type: z.string(),
      _key: z.string(),
      text: z.string(),
      marks: z.array(z.string()),
    }),
  ),
  markDefs: z.array(
    z.object({
      _key: z.string(),
      _type: z.string(),
      href: z.string().optional(),
      newTab: z.boolean().optional(),
    }),
  ),
});
// 2. 圖片區塊
export const BlockDividerSchema = z.object({
  _type: z.literal("divider"),
  _key: z.string(),
});
export const BlockImageSchema = z.object({
  _type: z.literal("image"),
  _key: z.string(),
  asset: z.object({
    _ref: z.string(),
    _type: z.string(),
  }),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

// 3. 程式碼區塊
export const BlockCodeSchema = z.object({
  _type: z.literal("code"),
  _key: z.string(),
  code: z.string(),
  language: z.string().optional(),
});

// 4. 表格區塊
export const BlockTableSchema = z.object({
  _type: z.literal("table"),
  _key: z.string(),
  caption: z.string().optional(),
  hasHeaderRow: z.boolean().optional(),
  rows: z
    .array(
      z.object({
        _key: z.string(),
        cells: z
          .array(
            z.object({
              _key: z.string(),
              text: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

// 5. 組合
export const BlockContentSchema = z.array(
  z.discriminatedUnion("_type", [
    BlockTextSchema,
    BlockDividerSchema,
    BlockImageSchema,
    BlockCodeSchema,
    BlockTableSchema,
  ]),
);

export type BlockContent = z.infer<typeof BlockContentSchema>;
