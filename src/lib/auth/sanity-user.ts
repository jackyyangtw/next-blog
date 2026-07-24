// src/lib/auth/sanity-user.ts
import { client } from "@/sanity/lib/client";

interface SanityAuthUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  role?: string;
}

export async function getOrCreateSanityUser(user: {
  email: string;
  name?: string;
  image?: string;
}) {
  const query = `*[_type == "user" && email == $email][0]`;
  const sanityUser = await client.fetch<SanityAuthUser | null>(query, {
    email: user.email,
  });

  if (!sanityUser) {
    const newUser = {
      _type: "user",
      name: user.name,
      email: user.email,
      image: user.image,
      role: "user",
    };
    const createdUser = await client.create(newUser);
    return createdUser as SanityAuthUser;
  }

  if (!sanityUser.image && user.image) {
    return client
      .patch(sanityUser._id)
      .set({ image: user.image })
      .commit<SanityAuthUser>();
  }

  return sanityUser;
}
