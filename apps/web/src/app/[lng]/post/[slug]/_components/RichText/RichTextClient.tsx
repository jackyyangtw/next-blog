"use client";

import Box from "@mui/material/Box";

import { PortableText, type PortableTextComponents } from "next-sanity";

import { BlockContent } from "@/schema/type/blockContent";

import { CodeBlockView } from "./CodeBlockView";
import { RichTextDivider } from "./RichTextDivider";
import { RichTextImage } from "./RichTextImage";
import {
  renderInlineCodeFallback,
  RichTextInlineCode,
} from "./RichTextInlineCode";
import { RichTextTable } from "./RichTextTable";
import type {
  RichTextBlockProps,
  RichTextBlockValue,
  RichTextChildrenProps,
  RichTextCodeValue,
  RichTextImageValue,
  RichTextLinkValue,
  RichTextTableValue,
  RichTextValueProps,
} from "./types";
import { getPostHeadingId } from "../postTableOfContents";
import { POST_SCROLL_OFFSET } from "../postScrollOffset";

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
      style={{ marginTop: 24, scrollMarginTop: POST_SCROLL_OFFSET }}
    >
      {renderInlineCodeFallback(children)}
    </h2>
  );
}

function RichTextHeading3({ children, value }: RichTextBlockProps) {
  return (
    <h3
      id={value?._key ? getPostHeadingId(value._key) : undefined}
      style={{ marginTop: 16, scrollMarginTop: POST_SCROLL_OFFSET }}
    >
      {renderInlineCodeFallback(children)}
    </h3>
  );
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: RichTextValueProps) => (
      <RichTextImage value={value as RichTextImageValue} />
    ),
    code: ({ value }: RichTextValueProps) => {
      const codeValue = (value ?? {}) as RichTextCodeValue;

      return (
        <CodeBlockView
          code={codeValue.code ?? ""}
          highlightedHtml={codeValue.highlightedHtml}
          language={codeValue.language}
        />
      );
    },
    table: ({ value }: RichTextValueProps) => (
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
    bullet: ({ children }: RichTextChildrenProps) => (
      <li>{renderInlineCodeFallback(children)}</li>
    ),
    number: ({ children }: RichTextChildrenProps) => (
      <li>{renderInlineCodeFallback(children)}</li>
    ),
  },
  marks: {
    code: ({ children }: RichTextChildrenProps) => (
      <RichTextInlineCode>{children}</RichTextInlineCode>
    ),
    link: ({ children, value }: RichTextChildrenProps & RichTextValueProps) => {
      const linkValue = (value ?? {}) as RichTextLinkValue;

      return (
        <a
          href={linkValue.href}
          target={linkValue.newTab ? "_blank" : undefined}
          rel={linkValue.newTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichTextClient({ value }: { value: BlockContent }) {
  return <PortableText value={value} components={components} />;
}
