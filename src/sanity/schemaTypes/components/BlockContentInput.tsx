"use client";

import { PortableTextInput } from "sanity";
import type { PortableTextInputProps } from "sanity";

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet";
  level?: number;
  markDefs: { _key: string; _type: string }[];
  children: {
    _key: string;
    _type: "span";
    text: string;
    marks: string[];
  }[];
};

type TableCell = {
  _key: string;
  _type: "tableCell";
  text: string;
};

type TableRow = {
  _key: string;
  _type: "tableRow";
  cells: TableCell[];
};

type TableBlock = {
  _key: string;
  _type: "table";
  hasHeaderRow: boolean;
  rows: TableRow[];
};

type ContentBlock = PortableTextBlock | TableBlock | { [key: string]: unknown };

function createKey() {
  return (
    globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 12) ??
    Math.random().toString(36).slice(2, 14)
  );
}

function createTextBlock(
  text: string,
  style: "normal" | "h2" | "h3" | "blockquote" = "normal",
  listItem?: "bullet",
): PortableTextBlock {
  return {
    _type: "block",
    _key: createKey(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: createKey(),
        text,
        marks: [],
      },
    ],
  };
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function isTableRow(line: string) {
  return /^\s*\|.+\|\s*$/.test(line);
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function createTableBlock(lines: string[]): TableBlock {
  const rows = lines
    .filter((line) => !isTableSeparator(line))
    .map((line) => ({
      _key: createKey(),
      _type: "tableRow" as const,
      cells: splitTableRow(line).map((text) => ({
        _key: createKey(),
        _type: "tableCell" as const,
        text,
      })),
    }));

  return {
    _key: createKey(),
    _type: "table",
    hasHeaderRow: true,
    rows,
  };
}

function hasMarkdownTable(lines: string[]) {
  return lines.some(
    (line, index) =>
      isTableRow(line) &&
      lines[index + 1] !== undefined &&
      isTableSeparator(lines[index + 1]),
  );
}

function markdownToPortableTextBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.replace(/^```/, "").trim() || undefined;
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        _type: "code",
        _key: createKey(),
        code: codeLines.join("\n"),
        ...(language ? { language } : {}),
      });

      index += 1;
      continue;
    }

    if (
      isTableRow(line) &&
      lines[index + 1] !== undefined &&
      isTableSeparator(lines[index + 1])
    ) {
      const tableLines = [line, lines[index + 1]];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }

      blocks.push(createTableBlock(tableLines));
      continue;
    }

    if (trimmed.startsWith("#")) {
      const level = trimmed.match(/^#+/)?.[0].length ?? 2;
      const text = trimmed.replace(/^#+\s*/, "");

      blocks.push(createTextBlock(text, level >= 3 ? "h3" : "h2"));
      index += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push(createTextBlock(quoteLines.join("\n"), "blockquote"));
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      blocks.push(
        createTextBlock(trimmed.replace(/^[-*]\s+/, ""), "normal", "bullet"),
      );
      index += 1;
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("#") &&
      !lines[index].trim().startsWith(">") &&
      !lines[index].trim().startsWith("```") &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !(
        isTableRow(lines[index]) &&
        lines[index + 1] !== undefined &&
        isTableSeparator(lines[index + 1])
      )
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(createTextBlock(paragraphLines.join("\n")));
  }

  return blocks;
}

export function BlockContentInput(props: PortableTextInputProps) {
  const handlePaste: NonNullable<PortableTextInputProps["onPaste"]> = (
    data,
  ) => {
    const markdown = data.event.clipboardData?.getData("text/plain");
    if (!markdown) {
      return undefined;
    }

    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    if (!hasMarkdownTable(lines)) {
      return undefined;
    }

    const blocks = markdownToPortableTextBlocks(markdown) as unknown as {
      _type: string;
      [key: string]: unknown;
    }[];

    return {
      insert: blocks,
      path: data.path,
    };
  };

  return <PortableTextInput {...props} onPaste={handlePaste} />;
}
