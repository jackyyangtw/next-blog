// src/lib/auth/sanity-user.ts
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

interface SanityAuthUser {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  role?: string;
}

const SANITY_AUTH_USER_QUERY = defineQuery(/* groq */ `
  *[_type == "user" && email == $email][0]{
    _id,
    name,
    email,
    image,
    role
  }
`);

export function getSanityUserByEmail(email: string) {
  return client.fetch<SanityAuthUser | null>(SANITY_AUTH_USER_QUERY, { email });
}

export async function getOrCreateSanityUser(user: {
  email: string;
  name?: string;
  image?: string;
}) {
  const sanityUser = await getSanityUserByEmail(user.email);

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
