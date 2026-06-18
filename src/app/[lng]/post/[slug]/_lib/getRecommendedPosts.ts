import { client } from "@/sanity/lib/client";

interface CategoryLite {
  _id: string;
  slug: string;
  title: string;
}

interface RecommendedPost {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  slug: string;
  photo: {
    asset: {
      _id: string;
      url?: string;
      metadata?: {
        lqip?: string;
      };
    };
    alt?: string;
  } | null;
  bannerSource?: string;
  presetBanner?: string;
  categories: CategoryLite[];
}

interface GetRecommendedPostsInput {
  slug: string;
  categoryIds: string[];
  limit?: number;
}

interface ScoredPost extends RecommendedPost {
  _score: number;
}

function getFreshnessScore(createdAt: string): number {
  const createdMs = new Date(createdAt).getTime();
  const diffDays = Math.max(
    0,
    (Date.now() - createdMs) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, 1 - diffDays / 90);
}

function getScore(post: RecommendedPost, categoryIds: string[]): number {
  const overlapCount = post.categories.filter((category) =>
    categoryIds.includes(category._id),
  ).length;
  const freshnessScore = getFreshnessScore(post._createdAt);
  return overlapCount * 4 + freshnessScore * 2;
}

export async function getRecommendedPosts({
  slug,
  categoryIds,
  limit = 3,
}: GetRecommendedPostsInput): Promise<RecommendedPost[]> {
  if (categoryIds.length === 0) {
    return client.fetch<RecommendedPost[]>(
      `*[_type == "post" && slug.current != $slug] | order(_createdAt desc) [0...$limit] {
        _id,
        _createdAt,
        title,
        description,
        bannerSource,
        presetBanner,
        photo{
          asset->{
            _id,
            url,
            metadata{
              lqip
            }
          },
          alt
        },
        "slug": slug.current,
        categories[]->{
          _id,
          title,
          "slug": slug.current
        }
      }`,
      { slug, limit },
      { next: { tags: ["posts", `recommended:${slug}`] } },
    );
  }

  const candidates = await client.fetch<RecommendedPost[]>(
    `*[
      _type == "post" &&
      slug.current != $slug &&
      count(categories[@._ref in $categoryIds]) > 0
    ] | order(_createdAt desc) [0...40] {
      _id,
      _createdAt,
      title,
      description,
      bannerSource,
      presetBanner,
      photo{
        asset->{
          _id,
          url,
          metadata{
            lqip
          }
        },
        alt
      },
      "slug": slug.current,
      categories[]->{
        _id,
        title,
        "slug": slug.current
      }
    }`,
    { slug, categoryIds },
    { next: { tags: ["posts", `recommended:${slug}`] } },
  );

  const sorted = candidates
    .map<ScoredPost>((post) => ({
      ...post,
      _score: getScore(post, categoryIds),
    }))
    .sort((a, b) => b._score - a._score);

  const selected: RecommendedPost[] = [];
  const selectedIds = new Set<string>();
  const usedPrimaryCategory = new Set<string>();

  for (const post of sorted) {
    const primaryCategory = post.categories[0]?._id ?? post._id;
    if (usedPrimaryCategory.has(primaryCategory)) {
      continue;
    }
    selected.push(post);
    selectedIds.add(post._id);
    usedPrimaryCategory.add(primaryCategory);
    if (selected.length >= limit) {
      break;
    }
  }

  if (selected.length < limit) {
    for (const post of sorted) {
      if (selectedIds.has(post._id)) {
        continue;
      }
      selected.push(post);
      if (selected.length >= limit) {
        break;
      }
    }
  }

  if (selected.length >= limit) {
    return selected.slice(0, limit);
  }

  const fallbackPosts = await client.fetch<RecommendedPost[]>(
    `*[_type == "post" && slug.current != $slug] | order(_createdAt desc) [0...$limit] {
      _id,
      _createdAt,
      title,
      description,
      bannerSource,
      presetBanner,
      photo{
        asset->{
          _id,
          url,
          metadata{
            lqip
          }
        },
        alt
      },
      "slug": slug.current,
      categories[]->{
        _id,
        title,
        "slug": slug.current
      }
    }`,
    { slug, limit },
    { next: { tags: ["posts", `recommended:${slug}`] } },
  );

  for (const post of fallbackPosts) {
    if (selectedIds.has(post._id)) {
      continue;
    }
    selected.push(post);
    if (selected.length >= limit) {
      break;
    }
  }

  return selected.slice(0, limit);
}
