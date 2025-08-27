// src/app/api/user/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const email = session.user.email;
  const query = `*[_type == "user" && email == $email][0]`;
  const user = await client.fetch(query, { email });

  if (!user) {
    return NextResponse.json({ error: "找不到使用者" }, { status: 404 });
  }

  // 可過濾敏感欄位
  return NextResponse.json(user);
}