interface ScoreablePost {
  _createdAt: string;
  categories: Array<{ _id: string }>;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const FRESHNESS_WINDOW_DAYS = 90;

function getFreshnessScore(createdAt: string, referenceTime: number): number {
  const createdMs = new Date(createdAt).getTime();
  const diffDays = Math.max(0, (referenceTime - createdMs) / DAY_IN_MS);
  return Math.max(0, 1 - diffDays / FRESHNESS_WINDOW_DAYS);
}

export function getRecommendationScore(
  post: ScoreablePost,
  categoryIds: string[],
  referenceTime: number,
): number {
  const overlapCount = post.categories.filter((category) =>
    categoryIds.includes(category._id),
  ).length;
  const freshnessScore = getFreshnessScore(post._createdAt, referenceTime);
  return overlapCount * 4 + freshnessScore * 2;
}
