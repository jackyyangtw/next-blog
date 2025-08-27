"use client";
import { useEffect } from "react";
// ------------- Next sanity -------------
import { PortableText, type PortableTextComponents } from "next-sanity";

// ------------- MUI -------------
import Box from "@mui/material/Box";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Components -------------
import { RichTextCodeBlock } from "./CodeBlock";

// ------------- Store -------------
import { useDialogStore } from "@/store/useDialogStore";

// ------------- Types -------------
import { BlockContent } from "@/schema/type/blockContent";

interface RichTextImageValue {
  asset?: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
  [key: string]: unknown;
}

interface DialogState {
  value: RichTextImageValue | null;
}

export default function RichText({ value }: { value: BlockContent }) {
  const { openDialog, imageDialog, closeDialog, reset } = useDialogStore();
  const [dialogContent, setDialogContent] = useState<DialogState>({
    value: null,
  });

  const handleImageClick = (imgValue: RichTextImageValue) => {
    openDialog("imageDialog");
    setDialogContent({ value: imgValue });
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

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <>
      <PortableText value={value} components={components} />
      <Dialog
        open={imageDialog}
        onClose={() => closeDialog("imageDialog")}
        maxWidth="xl"
        fullWidth
      >
        {dialogContent.value && (
          <>
            <DialogTitle>
              {dialogContent.value.caption || dialogContent.value.alt || ""}
            </DialogTitle>
            <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src={urlFor(dialogContent.value).width(1200).url()}
                alt={dialogContent.value.alt || ""}
                sx={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
