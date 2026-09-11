import { NextResponse } from "next/server";
import { z } from "zod";
import { publicClient } from "@/sanity/lib/client";
import { CategorySchema } from "@/schema/type/category";

const CategoriesResponseSchema = z.array(CategorySchema);

export async function GET() {
  const categories = await publicClient.fetch(
    `*[_type == "category"]{ _id, title, "slug": slug.current }`,
  );
  return NextResponse.json(CategoriesResponseSchema.parse(categories));
}
