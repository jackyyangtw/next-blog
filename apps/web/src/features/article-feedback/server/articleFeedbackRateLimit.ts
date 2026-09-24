import "server-only";

import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";

import { headers } from "next/headers";

import { buildToken, developerToken } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import {
  consumeArticleFeedbackRateLimit,
  type ArticleFeedbackRateLimitKind,
  type ArticleFeedbackRateLimitRecord,
  type ArticleFeedbackRateLimitStore,
} from "./articleFeedbackRateLimitPolicy";

interface StoredRateLimit {
  _rev: string;
  day: string;
  voteCount: number;
  followUpCount: number;
  votesByPost: Record<string, number>;
}

const store: ArticleFeedbackRateLimitStore = {
  async readOrCreate(id, day): Promise<ArticleFeedbackRateLimitRecord> {
    const document =
      (await client.getDocument<StoredRateLimit>(id)) ??
      (await client.createIfNotExists({
        _id: id,
        _type: "articleFeedbackRateLimit",
        day,
        voteCount: 0,
        followUpCount: 0,
        votesByPost: {},
      }));

    return {
      revision: document._rev,
      day: document.day,
      voteCount: document.voteCount ?? 0,
      followUpCount: document.followUpCount ?? 0,
      votesByPost: document.votesByPost ?? {},
    };
  },

  async compareAndSwap(id, revision, next): Promise<boolean> {
    try {
      await client.patch(id).ifRevisionId(revision).set(next).commit();
      return true;
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode === 409) {
        return false;
      }
      throw error;
    }
  },
};

export async function checkArticleFeedbackRateLimit(
  kind: ArticleFeedbackRateLimitKind,
  postId?: string,
): Promise<boolean> {
  const secret =
    process.env.ARTICLE_FEEDBACK_RATE_LIMIT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "production" ? buildToken : developerToken);

  if (!secret) {
    throw new Error("Article feedback rate limiting needs a server secret.");
  }

  let ip: string;
  if (process.env.VERCEL === "1") {
    const requestHeaders = await headers();
    const forwardedFor =
      requestHeaders.get("x-vercel-forwarded-for") ??
      requestHeaders.get("x-forwarded-for");
    const candidate = forwardedFor?.split(",")[0]?.trim();
    if (!candidate || !isIP(candidate)) {
      throw new Error("Trusted client IP is unavailable.");
    }
    ip = candidate;
  } else if (process.env.NODE_ENV !== "production") {
    ip = "local-development";
  } else {
    // A self-hosted proxy must provide a trusted IP source before writes open.
    throw new Error("Article feedback needs a trusted client IP source.");
  }

  const id = `articleFeedbackRateLimit.${createHmac("sha256", secret)
    .update(`article-feedback-ip:v1:${ip}`)
    .digest("hex")}`;
  const postKey = postId
    ? `p${createHash("sha256").update(postId).digest("hex").slice(0, 24)}`
    : undefined;
  const day = new Date().toISOString().slice(0, 10);

  return consumeArticleFeedbackRateLimit(store, id, day, kind, postKey);
}
