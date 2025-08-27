// import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { client } from "@/sanity/lib/client";

export async function GET() {
  // 1) 驗證登入
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { _id: string })?._id;
  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // 2) 查詢所有書籤
  const query = /* groq */ `
    *[_type == "bookmark" && user._ref == $userId]{
      _id,
      _createdAt,
      "post": post->{
        _id,
        title,
        description,
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
        },
        "slug": slug.current,
        photo
      }
    } | order(_createdAt desc)
  `;

  try {
    const items = await client.fetch(query, { userId }, { cache: "no-store" });
    return new Response(JSON.stringify(items), {
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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { _id: string })?._id;
  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  try {
    const { postId } = await req.json();
    if (!postId) {
      return new Response(JSON.stringify({ message: "postId is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    // 檢查是否已存在
    const exist = await client.fetch(
      '*[_type=="bookmark" && user._ref==$userId && post._ref==$postId][0]._id',
      { userId, postId }
    );
    if (exist) {
      return new Response(JSON.stringify({ message: "Already bookmarked" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    // 建立書籤
    const doc = {
      _type: "bookmark",
      user: { _type: "reference", _ref: userId },
      post: { _type: "reference", _ref: postId },
    };
    const created = await client.create(doc);
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("[POST /api/bookmarks] error:", err);
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { _id: string })?._id;
  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) {
      return new Response(JSON.stringify({ message: "postId is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    // 找到 bookmark id
    const bookmarkId = await client.fetch(
      '*[_type=="bookmark" && user._ref==$userId && post._ref==$postId][0]._id',
      { userId, postId }
    );
    if (!bookmarkId) {
      return new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
        headers: { "content-type": "application/json", },
      });
    }
    await client.delete(bookmarkId);
    return new Response(JSON.stringify({ message: "Bookmark deleted" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("[DELETE /api/bookmarks] error:", err);
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}