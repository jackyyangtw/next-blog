"use client";

import { useCallback, useState } from "react";
import { PortableTextInput } from "sanity";
import type { ArrayOfObjectsInputProps, PortableTextInputProps } from "sanity";
import {
  hasMarkdownTable,
  markdownToPortableTextBlocks,
} from "./markdownToPortableTextBlocks";

const EMPTY_HOTKEYS = {} as NonNullable<PortableTextInputProps["hotkeys"]>;

export function BlockContentInput(props: ArrayOfObjectsInputProps) {
  const portableTextProps = props as unknown as PortableTextInputProps;
  const [stableHotkeys] = useState(
    () => portableTextProps.hotkeys ?? EMPTY_HOTKEYS,
  );
  const [stablePath] = useState(() => props.path);
  const handlePaste = useCallback<
    NonNullable<PortableTextInputProps["onPaste"]>
  >((data) => {
    const markdown = data.event.clipboardData?.getData("text/plain");
    if (!markdown) {
      return undefined;
    }

    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    if (!hasMarkdownTable(lines)) {
      return undefined;
    }

    const blocks = markdownToPortableTextBlocks(markdown) as {
      _type: string;
      [key: string]: unknown;
    }[];

    return {
      insert: blocks,
    };
  }, []);

  return (
    <PortableTextInput
      {...portableTextProps}
      hotkeys={stableHotkeys}
      onPaste={handlePaste}
      path={stablePath}
    />
  );
}
