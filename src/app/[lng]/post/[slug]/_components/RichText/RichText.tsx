"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

// ------------- Next sanity -------------
import { PortableText, type PortableTextComponents } from "next-sanity";

// ------------- Components -------------
import { ImagePreviewDialog } from "./ImagePreviewDialog";
import { RichTextCodeBlock } from "./CodeBlock";
import { RichTextDivider } from "./RichTextDivider";
import { RichTextImage } from "./RichTextImage";
import { RichTextTable } from "./RichTextTable";

// ------------- Types -------------
import { BlockContent } from "@/schema/type/blockContent";
import { RichTextImageValue, RichTextTableValue } from "./types";

interface RichTextBlockValue {
  children?: unknown[];
}

interface RichTextBlockProps {
  children?: ReactNode;
  value?: RichTextBlockValue;
}

function isDividerText(text: string) {
  return text === "---" || text === "***" || text === "___";
}

function getBlockText(value?: RichTextBlockValue) {
  return (
    value?.children
      ?.map((child) => {
        if (typeof child !== "object" || child === null || !("text" in child)) {
          return "";
        }

        const text = (child as { text?: unknown }).text;
        return typeof text === "string" ? text : "";
      })
      .join("")
      .trim() ?? ""
  );
}

function RichTextNormalBlock({ children, value }: RichTextBlockProps) {
  if (isDividerText(getBlockText(value))) {
    return <RichTextDivider />;
  }

  return <p>{children}</p>;
}

export default function RichText({ value }: { value: BlockContent }) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [image, setImage] = useState<RichTextImageValue | null>(null);

  const handleImageClick = useCallback((imgValue: RichTextImageValue) => {
    setImage(imgValue);
    setIsImageDialogOpen(true);
  }, []);

  const handleCloseImageDialog = useCallback(() => {
    setIsImageDialogOpen(false);
    setImage(null);
  }, []);

  const components = useMemo<PortableTextComponents>(
    () => ({
      types: {
        image: ({ value }) => (
          <RichTextImage
            value={value as RichTextImageValue}
            onClick={handleImageClick}
          />
        ),
        code: ({ value }) => (
          <RichTextCodeBlock code={value?.code} language={value?.language} />
        ),
        table: ({ value }) => (
          <RichTextTable value={value as RichTextTableValue} />
        ),
        divider: RichTextDivider,
      },
      block: {
        normal: RichTextNormalBlock,
        h2: ({ children }) => <h2 style={{ marginTop: 24 }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{ marginTop: 16 }}>{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote style={{ margin: "24px 0", paddingLeft: 16 }}>
            {children}
          </blockquote>
        ),
        quote: ({ children }) => (
          <blockquote style={{ margin: "24px 0", paddingLeft: 16 }}>
            {children}
          </blockquote>
        ),
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
    }),
    [handleImageClick],
  );

  return (
    <>
      <PortableText value={value} components={components} />
      <ImagePreviewDialog
        image={image}
        open={isImageDialogOpen}
        onClose={handleCloseImageDialog}
      />
    </>
  );
}
