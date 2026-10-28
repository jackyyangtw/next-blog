import { NextResponse } from "next/server";
import { defineQuery } from "next-sanity";
import { z } from "zod";
import { publicClient } from "@/sanity/lib/client";
import { CategorySchema } from "@/schema/type/category";

const CATEGORIES_QUERY = defineQuery(
  /* groq */ `*[_type == "category"]{ _id, title, "slug": slug.current }`,
);

const CategoriesResponseSchema = z.array(CategorySchema);

export async function GET() {
  const categories = await publicClient.fetch(CATEGORIES_QUERY);
  return NextResponse.json(CategoriesResponseSchema.parse(categories));
}
