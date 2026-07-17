import type { BlockContent } from "@/schema/type/blockContent";

export interface PostTableOfContentsItem {
  id: string;
  text: string;
}

export interface PostTableOfContentsSection extends PostTableOfContentsItem {
  children: PostTableOfContentsItem[];
}

type PortableTextBlock = Extract<BlockContent[number], { _type: "block" }>;

export function getPostHeadingId(blockKey: string) {
  return `heading-${blockKey}`;
}

function isPortableTextBlock(
  block: BlockContent[number],
): block is PortableTextBlock {
  return block._type === "block";
}

function getBlockPlainText(block: PortableTextBlock) {
  return (
    block.children
      ?.map((child) => (typeof child.text === "string" ? child.text : ""))
      .join("")
      .trim() ?? ""
  );
}

export function getPostTableOfContents(
  content: BlockContent,
): PostTableOfContentsSection[] {
  const sections: PostTableOfContentsSection[] = [];

  for (const block of content) {
    if (!isPortableTextBlock(block)) {
      continue;
    }

    const text = getBlockPlainText(block);
    if (!text) {
      continue;
    }

    const item = {
      id: getPostHeadingId(block._key),
      text,
    };

    if (block.style === "h2") {
      sections.push({ ...item, children: [] });
      continue;
    }

    if (block.style === "h3" && sections.length > 0) {
      sections[sections.length - 1].children.push(item);
    }
  }

  return sections;
}
