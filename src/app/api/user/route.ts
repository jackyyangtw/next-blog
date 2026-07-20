// src/app/api/user/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

const USER_QUERY = `*[_type == "user" && email == $email][0]{
  _id,
  name,
  email,
  image,
  role
}`;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await client.fetch(USER_QUERY, { email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
