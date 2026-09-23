import { cacheLife, cacheTag } from "next/cache";
import { publicClient } from "@/sanity/lib/client";
import {
  FALLBACK_RECOMMENDED_POSTS_QUERY,
  RELATED_RECOMMENDED_POSTS_QUERY,
} from "./recommendedPostQueries";
import { getRecommendationScore } from "./recommendationScore";

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

interface RecommendedPostsQueryParams {
  categoryIds?: string[];
  limit?: number;
  slug: string;
}

async function fetchRecommendedPosts(
  query: string,
  params: RecommendedPostsQueryParams,
): Promise<RecommendedPost[]> {
  return publicClient.fetch<RecommendedPost[]>(query, params);
}

export async function getRecommendedPosts({
  slug,
  categoryIds,
  limit = 3,
}: GetRecommendedPostsInput): Promise<RecommendedPost[]> {
  "use cache";

  cacheTag("posts", `recommended:${slug}`);
  cacheLife({ stale: 300, revalidate: 86400, expire: 604800 });

  if (categoryIds.length === 0) {
    return fetchRecommendedPosts(FALLBACK_RECOMMENDED_POSTS_QUERY, {
      slug,
      limit,
    });
  }

  const candidates = await fetchRecommendedPosts(
    RELATED_RECOMMENDED_POSTS_QUERY,
    { slug, categoryIds },
  );

  const referenceTime = Date.now();
  const sorted = candidates
    .map<ScoredPost>((post) => ({
      ...post,
      _score: getRecommendationScore(post, categoryIds, referenceTime),
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

  const fallbackPosts = await fetchRecommendedPosts(
    FALLBACK_RECOMMENDED_POSTS_QUERY,
    { slug, limit },
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
