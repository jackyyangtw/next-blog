// src/lib/auth/sanity-user.ts
import { client } from "@/sanity/lib/client";

export async function getOrCreateSanityUser(user: { email: string; name?: string; image?: string }) {
  // 查詢
  const query = `*[_type == "user" && email == $email][0]`;
  let sanityUser = await client.fetch(query, { email: user.email });

  // 若不存在則建立
  if (!sanityUser) {
    const newUser = {
      _type: "user",
      name: user.name,
      email: user.email,
      image: user.image,
      role: "user", // 預設角色
    };
    sanityUser = await client.create(newUser);
  }
  return sanityUser;
}