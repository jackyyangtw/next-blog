import { expect, test } from "vitest";
import { getRecommendationScore } from "./recommendationScore";

const referenceTime = Date.parse("2026-09-23T00:00:00.000Z");

test("分類重疊對推薦分數的影響大於新鮮度", () => {
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

test("分類重疊相同時，較新的文章分數較高", () => {
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
