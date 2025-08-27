import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  const categories = await client.fetch(
    `*[_type == "category"]{ _id, title, "slug": slug.current }`
  );
  return NextResponse.json(categories);
}