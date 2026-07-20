import { NextRequest, NextResponse } from "next/server";
import { publicClient } from "@/sanity/lib/client";
import { PostDoc } from "@/schema/type/post";

const POSTS_QUERY = `*[
  _type == "post" &&
  (!defined($categories) || count(categories[@->slug.current in $categories]) > 0) &&
  (!defined($keyword) || title match $keyword || description match $keyword)
] | order(_createdAt desc) [$start...$end] {
  _id,
  _createdAt,
  title,
  description,
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
}`;

const POSTS_COUNT_QUERY = `count(*[
  _type == "post" &&
  (!defined($categories) || count(categories[@->slug.current in $categories]) > 0) &&
  (!defined($keyword) || title match $keyword || description match $keyword)
])`;

function getBoundedInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
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

  const keyword = searchParams.get("keyword")?.trim().slice(0, 100);
  const params = {
    start,
    end,
    categories: categories.length ? categories : null,
    keyword: keyword ? `*${keyword}*` : null,
  };

  const total = await publicClient.fetch<number>(POSTS_COUNT_QUERY, params, {
    next: { tags: ["posts"] },
  });

  const posts = await publicClient.fetch<PostDoc[]>(POSTS_QUERY, params, {
    next: { tags: ["posts"] },
  });

  const resData = {
    data: posts,
    total,
    page,
    limit,
  };

  return NextResponse.json(resData);
}
