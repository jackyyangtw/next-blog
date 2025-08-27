import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { PostDoc } from "@/schema/type/post";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50); // 上限 50 筆
  const start = (page - 1) * limit;
  const end = start + limit;

  // 解析 categories filter
  const categoriesParam = searchParams.get("categories");
  const categoriesArr = categoriesParam
    ? categoriesParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];
  const hasCategoryFilter = categoriesArr.length > 0;
  // const categoriesFilter = hasCategoryFilter
  //   ? `count(categories[@._ref in [${categoriesArr.map((id) => `"${id}"`).join(",")}]] ) > 0`
  //   : "true";
  //  slug filter
  const categoriesFilter = hasCategoryFilter
    ? `count(categories[@->slug.current in [${categoriesArr.map((s) => `"${s}"`).join(",")}]] ) > 0`
    : "true";

  // 解析關鍵字搜尋條件
  const keyword = searchParams.get("keyword")?.trim() || "";
  const hasKeyword = keyword.length > 0;
  // Sanity match 支援萬用字元，需 escape 雙引號
  const escapedKeyword = keyword.replace(/"/g, '\\"');
  const keywordFilter = hasKeyword
    ? `(title match "*${escapedKeyword}*" || description match "*${escapedKeyword}*")`
    : "true";

  // 查詢總筆數（加上分類與關鍵字條件）
  const total = await client.fetch<number>(
    `count(*[_type == "post" && ${categoriesFilter} && ${keywordFilter}])`
  );

  // 查詢分頁資料（加上分類與關鍵字條件）
  const posts = await client.fetch<PostDoc[]>(
    `*[_type == "post" && ${categoriesFilter} && ${keywordFilter}] | order(_createdAt desc) [${start}...${end}] {
      _id,
      _createdAt,
      title,
      description,
      photo,
      "slug": slug.current,
      categories[]->{
        _id,
        title,
        "slug": slug.current
      },
      author->{
        _id,
        name,
        "slug": slug.current,
        email,
        avatar
      }
    }`
  );
  const resData = {
    data: posts,
    total,
    page,
    limit,
  };

  return NextResponse.json(resData);
}
