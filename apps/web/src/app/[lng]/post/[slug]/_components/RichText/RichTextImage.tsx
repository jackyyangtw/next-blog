import Box from "@mui/material/Box";

import { urlFor } from "@/sanity/lib/image";

import { RichTextImageValue } from "./types";

interface RichTextImageProps {
  value: RichTextImageValue;
  onClick: (value: RichTextImageValue) => void;
}

export function RichTextImage({ value, onClick }: RichTextImageProps) {
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
        onClick={() => onClick(value)}
      />
      {value?.caption && <figcaption>{value.caption}</figcaption>}
    </>
  );
}
