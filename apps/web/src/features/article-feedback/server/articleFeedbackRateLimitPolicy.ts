export const MAX_VOTES_PER_DAY = 20;
export const MAX_VOTES_PER_POST_PER_DAY = 2;
export const MAX_FOLLOW_UP_ATTEMPTS_PER_DAY = 20;

export interface ArticleFeedbackRateLimitRecord {
  revision: string;
  day: string;
  voteCount: number;
  followUpCount: number;
  votesByPost: Record<string, number>;
}

export type ArticleFeedbackRateLimitKind = "vote" | "followUp";

export interface ArticleFeedbackRateLimitStore {
  readOrCreate(
    id: string,
    day: string,
  ): Promise<ArticleFeedbackRateLimitRecord>;
  compareAndSwap(
    id: string,
    revision: string,
    next: Omit<ArticleFeedbackRateLimitRecord, "revision">,
  ): Promise<boolean>;
}

export async function consumeArticleFeedbackRateLimit(
  store: ArticleFeedbackRateLimitStore,
  id: string,
  day: string,
  kind: ArticleFeedbackRateLimitKind,
  postKey?: string,
): Promise<boolean> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const current = await store.readOrCreate(id, day);
    const sameDay = current.day === day;
    const voteCount = sameDay ? current.voteCount : 0;
    const followUpCount = sameDay ? current.followUpCount : 0;
    const votesByPost = sameDay ? current.votesByPost : {};

    if (kind === "vote") {
      if (
        !postKey ||
        voteCount >= MAX_VOTES_PER_DAY ||
        (votesByPost[postKey] ?? 0) >= MAX_VOTES_PER_POST_PER_DAY
      ) {
        return false;
      }
    } else if (followUpCount >= MAX_FOLLOW_UP_ATTEMPTS_PER_DAY) {
      return false;
    }

    const next = {
      day,
      voteCount: voteCount + (kind === "vote" ? 1 : 0),
      followUpCount: followUpCount + (kind === "followUp" ? 1 : 0),
      votesByPost:
        kind === "vote"
          ? { ...votesByPost, [postKey!]: (votesByPost[postKey!] ?? 0) + 1 }
          : votesByPost,
    };

    if (await store.compareAndSwap(id, current.revision, next)) {
      return true;
    }
  }

  // Persistent contention is treated as a denial, so no unmetered write occurs.
  return false;
}
