"use client";
// ------------- Next sanity -------------
import { PortableText, type PortableTextComponents } from "next-sanity";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Components -------------
import { RichTextCodeBlock } from "./CodeBlock";

// ------------- Types -------------
import { BlockContent } from "@/schema/type/blockContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface RichTextImageValue {
  asset?: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
  [key: string]: unknown;
}

export default function RichText({ value }: { value: BlockContent }) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [image, setImage] = useState<RichTextImageValue | null>(null);

  const handleImageClick = (imgValue: RichTextImageValue) => {
    setImage(imgValue);
    setIsImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false);
    setImage(null);
  };

  const components: PortableTextComponents = {
    types: {
      image: ({ value }) => (
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
            onClick={() => handleImageClick(value)}
          />
          {value?.caption && <figcaption>{value.caption}</figcaption>}
        </>
      ),
      code: ({ value }) => (
        <RichTextCodeBlock code={value?.code} language={value?.language} />
      ),
    },
    block: {
      h2: ({ children }) => <h2 style={{ marginTop: 24 }}>{children}</h2>,
      h3: ({ children }) => <h3 style={{ marginTop: 16 }}>{children}</h3>,
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target={value?.newTab ? "_blank" : undefined}
          rel={value?.newTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <>
      <PortableText value={value} components={components} />
      <Dialog
        open={isImageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth="xl"
        // 增加點擊背景模糊
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          },
          paper: {
            sx: {
              bgcolor: "#1E1E1E",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            },
          },
        }}
      >
        {image && (
          <>
            {/* 懸浮關閉按鈕 */}
            <IconButton
              onClick={handleCloseImageDialog}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: "white",
                bgcolor: "rgba(0,0,0,0.3)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent
              sx={{ p: 0, display: "flex", flexDirection: "column" }}
            >
              <Box
                component="img"
                src={urlFor(image).width(1600).url()}
                alt={image.alt || ""}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              {/* 將標題/圖說放在底部，增加設計感 */}
              {(image.caption || image.alt) && (
                <Box sx={{ p: 2, textAlign: "center", color: "grey.400" }}>
                  <Typography variant="body2">
                    {image.caption || image.alt}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
