export type RevalidateWebhookPayload = {
  _type?: string;
  slug?: string | null;
  oldSlug?: string | null;
};

/**
 * 依 Sanity webhook payload 決定要清除的 cache tag。
 * - "posts"：首頁與推薦文章等列表
 * - `post:${slug}`：單篇文章詳情
 * - "post-detail"：所有文章詳情（作者、分類等被引用的資料變動時使用）
 */
export function getRevalidateTags(payload: RevalidateWebhookPayload) {
  if (payload._type !== "post") {
    return ["posts", "post-detail"];
  }

  const slugs = new Set(
    [payload.slug, payload.oldSlug].filter((slug): slug is string =>
      Boolean(slug),
    ),
  );
  return ["posts", ...Array.from(slugs, (slug) => `post:${slug}`)];
}
