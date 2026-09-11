"use client";

import Box from "@mui/material/Box";
import { useState } from "react";

import { urlFor } from "@/sanity/lib/image";

import { ImagePreviewDialog } from "./ImagePreviewDialog";
import type { RichTextImageValue } from "./types";

interface RichTextImageProps {
  value: RichTextImageValue;
}

export function RichTextImage({ value }: RichTextImageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Box
        component="img"
        src={urlFor(value).width(880).url()}
        alt={value?.alt || ""}
        sx={{
          cursor: "pointer",
          transition: "scale 0.3s",
          "&:hover": { scale: 1.03 },
        }}
        onClick={() => setIsPreviewOpen(true)}
      />
      {value?.caption && <figcaption>{value.caption}</figcaption>}
      <ImagePreviewDialog
        image={value}
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
