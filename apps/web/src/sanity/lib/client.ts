import "server-only";
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

// Public read client. No token.
export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
