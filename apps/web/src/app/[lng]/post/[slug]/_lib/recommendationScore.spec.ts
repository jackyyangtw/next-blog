import { expect, test } from "@playwright/test";
import { getRecommendationScore } from "./recommendationScore";

const referenceTime = Date.parse("2026-09-23T00:00:00.000Z");

test("category overlap contributes more than freshness", () => {
  const score = getRecommendationScore(
    {
      _createdAt: "2026-06-25T00:00:00.000Z",
      categories: [{ _id: "nextjs" }],
    },
    ["nextjs"],
    referenceTime,
  );

  expect(score).toBe(4);
});

test("newer posts rank higher when category overlap is equal", () => {
  const categories = [{ _id: "nextjs" }];
  const recentScore = getRecommendationScore(
    { _createdAt: "2026-09-22T00:00:00.000Z", categories },
    ["nextjs"],
    referenceTime,
  );
  const olderScore = getRecommendationScore(
    { _createdAt: "2026-08-24T00:00:00.000Z", categories },
    ["nextjs"],
    referenceTime,
  );

  expect(recentScore).toBeGreaterThan(olderScore);
});
