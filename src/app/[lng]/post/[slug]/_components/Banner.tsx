"use client";

import Box from "@mui/material/Box";
import Image from "next/image";

import { PostDoc } from "@/schema/type/post";
import {
  getPostBannerAlt,
  getPostBannerBlurDataURL,
  getPostBannerImageSrc,
} from "@/sanity/postBanner";

export default function Banner({ post }: { post: PostDoc }) {
  const imageSrc = getPostBannerImageSrc(post, { width: 1600, height: 686 });
  const blurDataURL = getPostBannerBlurDataURL(post);

  if (!imageSrc) {
    return null;
  }

  return (
    <Box
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
        position: "relative",
        aspectRatio: { xs: "16 / 9", md: "21 / 9" },
      }}
    >
      <Image
        src={imageSrc}
        alt={getPostBannerAlt(post)}
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        style={{
          objectFit: "cover",
        }}
        preload
      />
    </Box>
  );
}
