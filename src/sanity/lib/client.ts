// src/sanity/lib/client.ts
import { createClient } from "next-sanity";

import {
  apiVersion,
  dataset,
  developerToken,
  projectId,
  buildToken,
} from "../env";

const token =
  process.env.NODE_ENV === "production" ? buildToken : developerToken;

export const client = createClient({
  token,
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

// 用於前端圖片，走 CDN，不帶 token
export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
