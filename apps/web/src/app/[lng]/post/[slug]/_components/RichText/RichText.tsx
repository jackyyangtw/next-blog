import "server-only";

import type { BlockContent } from "@/schema/type/blockContent";

import { highlightCode } from "./CodeBlock";
import { RichTextClient } from "./RichTextClient";

export default async function RichText({ value }: { value: BlockContent }) {
  const highlightedValue = await Promise.all(
    value.map(async (block) => {
      if (block._type !== "code") {
        return block;
      }

      return {
        ...block,
        highlightedHtml: await highlightCode(block.code, block.language),
      };
    }),
  );

  return <RichTextClient value={highlightedValue} />;
}
