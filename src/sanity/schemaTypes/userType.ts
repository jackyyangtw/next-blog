import { defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "名稱",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "image",
      title: "頭像",
      type: "url", // 這裡用 url
      description: "Google OAuth 回傳的頭像網址",
      readOnly: true,
    }),
    defineField({
      name: "role",
      title: "角色",
      type: "string",
      options: {
        list: [
          { title: "管理員", value: "admin" },
          { title: "一般使用者", value: "user" },
          { title: "編輯者", value: "editor" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "建立時間",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "更新時間",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    // 進階權限（可選）
    // defineField({
    //   name: "permissions",
    //   title: "權限",
    //   type: "array",
    //   of: [{ type: "string" }],
    // }),
    // defineField({
    //   name: "isActive",
    //   title: "啟用狀態",
    //   type: "boolean",
    //   initialValue: true,
    // }),
  ],
});