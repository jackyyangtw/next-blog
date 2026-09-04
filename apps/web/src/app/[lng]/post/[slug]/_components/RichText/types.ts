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
