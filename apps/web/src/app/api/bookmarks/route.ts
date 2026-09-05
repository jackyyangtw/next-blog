import { NextResponse } from "next/server";
import { z } from "zod";
import { BookmarkInputSchema, BookmarkSchema } from "@/schema/type/bookmark";
import {
  BookmarkError,
  mutateBookmark,
} from "@/features/bookmarks/server/mutateBookmark";
import { sanityBookmarkStore } from "@/features/bookmarks/server/sanityBookmarkStore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { client } from "@/sanity/lib/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;
  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const query = /* groq */ `
    *[_type == "bookmark" && user._ref == $userId]{
      _id,
      _createdAt,
      "post": post->{
        _id,
        _createdAt,
        title,
        description,
        bannerSource,
        presetBanner,
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
        },
        "slug": slug.current,
        photo{
          asset->{
            _id,
            url,
            metadata{
              lqip
            }
          },
          alt
        }
      }
    } | order(_createdAt desc)
  `;

  try {
    const items = await client.fetch(query, { userId }, { cache: "no-store" });
    return new Response(JSON.stringify(z.array(BookmarkSchema).parse(items)), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("[GET /api/bookmarks] error:", err);
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

async function handleMutation(req: Request, bookmarked: boolean) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const input: unknown = bookmarked
      ? await req.json()
      : { postId: new URL(req.url).searchParams.get("postId") };
    const parsed = BookmarkInputSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "A valid postId is required" },
        { status: 400 },
      );
    }
    const result = await mutateBookmark(
      sanityBookmarkStore,
      userId,
      parsed.data.postId,
      bookmarked,
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }
    if (error instanceof BookmarkError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    console.error("[bookmark mutation] error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return handleMutation(req, true);
}

export async function DELETE(req: Request) {
  return handleMutation(req, false);
}
