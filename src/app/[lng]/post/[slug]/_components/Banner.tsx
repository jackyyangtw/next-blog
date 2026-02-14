"use client";
import Image from "next/image";
import Box from "@mui/material/Box";
import { PostDoc } from "@/schema/type/post";
import { useNextSanityImage } from "next-sanity-image";
import { publicClient } from "@/sanity/lib/client";

export default function Banner({ post }: { post: PostDoc }) {
  const imageProps = useNextSanityImage(publicClient, post.photo);

  return (
    <Box 
      sx={{ 
        boxShadow: 2, 
        borderRadius: 2, // 增加一點圓角增加質感
        overflow: 'hidden', 
        width: '100%',
        // 設定統一的寬高比，例如 16:9 或 2:1
        aspectRatio: { xs: '16 / 9', md: '21 / 9' }, 
      }}
    >
      <Image
        {...imageProps}
        alt={post.title}
        sizes="(max-width: 1200px) 100vw, 1200px"
        placeholder="blur"
        blurDataURL={post.photo.asset.metadata.lqip}
        style={{
          width: "100%",
          height: "100%", // 改為 100% 以填滿 Box
          objectFit: "cover", // 確保圖片不變形地填滿空間
        }}
        // 注意：當使用 object-fit 時，width/height 主要是給 Next.js 計算比例用
        width={1200}
        height={628}
        priority
      />
    </Box>
  );
}