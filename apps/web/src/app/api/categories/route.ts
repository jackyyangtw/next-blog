import { NextResponse } from "next/server";
import { publicClient } from "@/sanity/lib/client";

export async function GET() {
  const categories = await publicClient.fetch(
    `*[_type == "category"]{ _id, title, "slug": slug.current }`,
  );
  return NextResponse.json(categories);
}
