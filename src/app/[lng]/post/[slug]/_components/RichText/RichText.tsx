"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { useCallback, useMemo, useState } from "react";

// ------------- Next sanity -------------
import { PortableText, type PortableTextComponents } from "next-sanity";

// ------------- Components -------------
import { ImagePreviewDialog } from "./ImagePreviewDialog";
import { RichTextCodeBlock } from "./CodeBlock";
import { RichTextDivider } from "./RichTextDivider";
import { RichTextImage } from "./RichTextImage";
import {
  renderInlineCodeFallback,
  RichTextInlineCode,
} from "./RichTextInlineCode";
import { RichTextTable } from "./RichTextTable";

// ------------- Types -------------
import { BlockContent } from "@/schema/type/blockContent";
import { RichTextImageValue, RichTextTableValue } from "./types";
import { getPostHeadingId } from "../postTableOfContents";

const POST_HEADING_SCROLL_MARGIN_TOP = 128;

interface RichTextBlockValue {
  _key?: string;
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

  return <p>{renderInlineCodeFallback(children)}</p>;
}

function RichTextBlockquote({ children }: RichTextBlockProps) {
  return (
    <Box
      component="blockquote"
      sx={{
        my: 3,
        mx: 0,
        py: 0.5,
        pl: 2,
        borderLeft: "4px solid",
        borderColor: "primary.main",
        color: "text.secondary",
        fontStyle: "normal",
      }}
    >
      {renderInlineCodeFallback(children)}
    </Box>
  );
}

function RichTextHeading2({ children, value }: RichTextBlockProps) {
  return (
    <h2
      id={value?._key ? getPostHeadingId(value._key) : undefined}
      style={{ marginTop: 24, scrollMarginTop: POST_HEADING_SCROLL_MARGIN_TOP }}
    >
      {renderInlineCodeFallback(children)}
    </h2>
  );
}

function RichTextHeading3({ children, value }: RichTextBlockProps) {
  return (
    <h3
      id={value?._key ? getPostHeadingId(value._key) : undefined}
      style={{ marginTop: 16, scrollMarginTop: POST_HEADING_SCROLL_MARGIN_TOP }}
    >
      {renderInlineCodeFallback(children)}
    </h3>
  );
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
        h2: RichTextHeading2,
        h3: RichTextHeading3,
        blockquote: RichTextBlockquote,
        quote: RichTextBlockquote,
      },
      listItem: {
        bullet: ({ children }) => <li>{renderInlineCodeFallback(children)}</li>,
        number: ({ children }) => <li>{renderInlineCodeFallback(children)}</li>,
      },
      marks: {
        code: ({ children }) => (
          <RichTextInlineCode>{children}</RichTextInlineCode>
        ),
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
