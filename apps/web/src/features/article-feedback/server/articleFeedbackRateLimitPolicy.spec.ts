import { expect, test } from "vitest";

import {
  consumeArticleFeedbackRateLimit,
  MAX_FOLLOW_UP_ATTEMPTS_PER_DAY,
  MAX_VOTES_PER_DAY,
  MAX_VOTES_PER_POST_PER_DAY,
  type ArticleFeedbackRateLimitRecord,
  type ArticleFeedbackRateLimitStore,
} from "./articleFeedbackRateLimitPolicy";

function createStore(): {
  store: ArticleFeedbackRateLimitStore;
  current: () => ArticleFeedbackRateLimitRecord;
} {
  let record: ArticleFeedbackRateLimitRecord = {
    revision: "0",
    day: "2026-09-24",
    voteCount: 0,
    followUpCount: 0,
    votesByPost: {},
  };

  return {
    current: () => record,
    store: {
      async readOrCreate() {
        return { ...record, votesByPost: { ...record.votesByPost } };
      },
      async compareAndSwap(_id, revision, next) {
        if (record.revision !== revision) {
          return false;
        }
        record = {
          ...next,
          revision: String(Number(record.revision) + 1),
        };
        return true;
      },
    },
  };
}

test("同一篇文章一天最多接受兩次投票，並發請求也不能超額", async () => {
  const { store, current } = createStore();
  const results = await Promise.all(
    Array.from({ length: 8 }, () =>
      consumeArticleFeedbackRateLimit(
        store,
        "ip-1",
        "2026-09-24",
        "vote",
        "post-1",
      ),
    ),
  );

  expect(results.filter(Boolean)).toHaveLength(MAX_VOTES_PER_POST_PER_DAY);
  expect(current().voteCount).toBe(MAX_VOTES_PER_POST_PER_DAY);
});

test("不同文章的投票仍受每天總量限制", async () => {
  const { store, current } = createStore();
  const results: boolean[] = [];
  for (let index = 0; index < MAX_VOTES_PER_DAY + 1; index += 1) {
    results.push(
      await consumeArticleFeedbackRateLimit(
        store,
        "ip-1",
        "2026-09-24",
        "vote",
        `post-${index}`,
      ),
    );
  }

  expect(results.filter(Boolean)).toHaveLength(MAX_VOTES_PER_DAY);
  expect(current().voteCount).toBe(MAX_VOTES_PER_DAY);
});

test("無效補充請求也計入次數，隔天重新開始計數", async () => {
  const { store, current } = createStore();

  for (let index = 0; index < MAX_FOLLOW_UP_ATTEMPTS_PER_DAY; index += 1) {
    expect(
      await consumeArticleFeedbackRateLimit(
        store,
        "ip-1",
        "2026-09-24",
        "followUp",
      ),
    ).toBe(true);
  }

  expect(
    await consumeArticleFeedbackRateLimit(
      store,
      "ip-1",
      "2026-09-24",
      "followUp",
    ),
  ).toBe(false);
  expect(
    await consumeArticleFeedbackRateLimit(
      store,
      "ip-1",
      "2026-09-25",
      "vote",
      "post-1",
    ),
  ).toBe(true);
  expect(current().followUpCount).toBe(0);
  expect(current().voteCount).toBe(1);
});
