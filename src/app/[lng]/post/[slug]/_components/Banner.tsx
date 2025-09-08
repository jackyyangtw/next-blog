"use client";
import Image from "next/image";
import { PostDoc } from "@/schema/type/post";
import { useNextSanityImage } from "next-sanity-image";
import { publicClient } from "@/sanity/lib/client";

export default function Banner({ post }: { post: PostDoc }) {
  const imageProps = useNextSanityImage(publicClient, post.photo);
  return (
    <Image
      {...imageProps}
      alt={post.title}
      sizes="(max-width: 1200px) 100vw, 1200px"
      placeholder="blur"
      blurDataURL={post.photo.asset.metadata.lqip}
      style={{ width: "100%", height: "auto" }}
      width={1200}
      height={628}
      priority
    />
  );
}
