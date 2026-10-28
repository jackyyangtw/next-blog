import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
const CONTENT_TYPES = ["post", "category", "author"];
const USER_DATA_TYPES = ["user", "bookmark", "articleFeedback"];
const GROUPED_TYPES = new Set([...CONTENT_TYPES, ...USER_DATA_TYPES]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...CONTENT_TYPES.map((type) => S.documentTypeListItem(type)),
      S.divider().title("使用者資料"),
      S.documentTypeListItem("user"),
      S.documentTypeListItem("bookmark"),
      S.documentTypeListItem("articleFeedback").child(
        S.documentTypeList("articleFeedback")
          .title("Article Feedback")
          .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
      ),
      // 之後新增但尚未分組的文件類型
      ...S.documentTypeListItems().filter(
        (item) => !GROUPED_TYPES.has(item.getId() ?? ""),
      ),
    ]);
