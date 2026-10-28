import {
  POST_BANNER_SOURCE,
  getPostBannerPreset,
} from "@/sanity/constants/postBanners";
import { urlFor } from "@/sanity/lib/image";

// Sanity 查詢結果的缺值為 null，zod 解析後則為 undefined，兩者都要接受
type SanityPhoto = {
  asset?: {
    metadata?: {
      lqip?: string | null;
    } | null;
  } | null;
};

type PostBannerInput = {
  title?: string | null;
  bannerSource?: string | null;
  presetBanner?: string | null;
  photo?: SanityPhoto | null;
};

interface PostBannerImageOptions {
  width?: number;
  height?: number;
}

export function getPostBannerImageSrc(
  post: PostBannerInput,
  options: PostBannerImageOptions = {},
) {
  const preset = getPostBannerPreset(post.presetBanner);
  if (post.bannerSource === POST_BANNER_SOURCE.preset && preset) {
    return preset.path;
  }

  if (post.photo?.asset) {
    const image = urlFor(post.photo);
    if (options.width) {
      image.width(options.width);
    }
    if (options.height) {
      image.height(options.height);
    }
    return image.url();
  }

  if (preset) {
    return preset.path;
  }

  return null;
}

export function getPostBannerAlt(post: PostBannerInput) {
  return getPostBannerPreset(post.presetBanner)?.alt ?? post.title ?? "";
}

export function getPostBannerBlurDataURL(post: PostBannerInput) {
  return post.photo?.asset?.metadata?.lqip ?? undefined;
}

export function hasPostBannerImage(post: PostBannerInput) {
  return Boolean(getPostBannerImageSrc(post));
}
