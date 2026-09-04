import type { ReactNode } from "react";

export interface RichTextBlockValue {
  _key?: string;
  children?: unknown[];
}

export interface RichTextBlockProps {
  children?: ReactNode;
  value?: RichTextBlockValue;
}

export interface RichTextValueProps {
  value: unknown;
}

export interface RichTextChildrenProps {
  children?: ReactNode;
}

export interface RichTextCodeValue {
  code?: string;
  language?: string;
}

export interface RichTextLinkValue {
  href?: string;
  newTab?: boolean;
}

export interface RichTextImageValue {
  asset?: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
  [key: string]: unknown;
}

export interface RichTextTableValue {
  caption?: string;
  hasHeaderRow?: boolean;
  rows?: {
    _key: string;
    cells?: {
      _key: string;
      text?: string;
    }[];
  }[];
}
