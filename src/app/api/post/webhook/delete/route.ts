// src/app/api/webhooks/sanity-delete/route.ts
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { _id, _type } = body;

    // 只處理 post 類型的刪除事件
    if (_type === "post" && _id) {
      // 搜尋所有關聯到此 post 的書籤並執行刪除
      // 使用 GROQ 找出 post._ref 等於該 ID 的書籤
      const query = `*[_type == "bookmark" && post._ref == $id]._id`;
      const bookmarkIds = await client.fetch(query, { id: _id });

      if (bookmarkIds.length > 0) {
        const transaction = client.transaction();
        bookmarkIds.forEach((id: string) => transaction.delete(id));
        await transaction.commit();
        console.log(`已清理文章 ${_id} 的 ${bookmarkIds.length} 筆書籤`);
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}