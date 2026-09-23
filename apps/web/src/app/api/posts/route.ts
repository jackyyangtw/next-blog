import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defineQuery } from "next-sanity";
import { publicClient } from "@/sanity/lib/client";
import { PostsResponseSchema, type PostSummary } from "@/schema/type/post";
import { getSearchSnippet } from "./getSearchSnippet";
import { getPostSearchPatterns } from "./searchPatterns";

const POST_SEARCH_FILTER = `(
  !defined($keyword) ||
  title match $keyword ||
  description match $keyword ||
  pt::text(content) match $keyword ||
  count(categories[@->title match $keyword || @->slug.current match $keyword]) > 0 ||
  (defined($alternateKeyword) && (
    title match $alternateKeyword ||
    description match $alternateKeyword ||
    pt::text(content) match $alternateKeyword ||
    count(categories[@->title match $alternateKeyword || @->slug.current match $alternateKeyword]) > 0
  ))
)`;

const POSTS_QUERY = defineQuery(/* groq */ `*[
  _type == "post" &&
  (!defined($categories) || count(categories[@->slug.current in $categories]) > 0) &&
  ${POST_SEARCH_FILTER}
] | order(_createdAt desc) [$start...$end] {
  _id,
  _createdAt,
  title,
  description,
  "searchContent": select(
    defined($keyword) && (
      pt::text(content) match $keyword ||
      (defined($alternateKeyword) && pt::text(content) match $alternateKeyword)
    ) => pt::text(content)
  ),
  bannerSource,
  presetBanner,
  photo{
    asset->{
      _id,
      url,
      metadata{
        lqip
      }
    },
    alt
  },
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
    avatar
  }
}`);

const POSTS_COUNT_QUERY = defineQuery(/* groq */ `count(*[
  _type == "post" &&
  (!defined($categories) || count(categories[@->slug.current in $categories]) > 0) &&
  ${POST_SEARCH_FILTER}
])`);

function getBoundedInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const page = getBoundedInteger(searchParams.get("page"), 1, 1, 10000);
  const limit = getBoundedInteger(searchParams.get("limit"), 10, 1, 50);
  const start = (page - 1) * limit;
  const end = start + limit;

  const categoriesParam = searchParams.get("categories");
  const categories = categoriesParam
    ? categoriesParam
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];

  const params = {
    start,
    end,
    categories: categories.length ? categories : null,
    ...getPostSearchPatterns(keyword),
  };

  const total = await publicClient.fetch<number>(POSTS_COUNT_QUERY, params, {
    next: { tags: ["posts"] },
  });

  const posts = await publicClient.fetch<
    (PostSummary & { searchContent?: string | null })[]
  >(POSTS_QUERY, params, {
    next: { tags: ["posts"] },
  });

  const resData = {
    data: posts.map(({ searchContent, ...post }) => ({
      ...post,
      searchSnippet: searchContent
        ? getSearchSnippet(searchContent, keyword)
        : null,
    })),
    total,
    page,
    limit,
  };

  return NextResponse.json(PostsResponseSchema.parse(resData));
}
