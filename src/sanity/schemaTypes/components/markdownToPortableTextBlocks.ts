type PortableTextSpan = {
  _key: string;
  _type: "span";
  text: string;
  marks: string[];
};

type PortableTextMarkDef = {
  _key: string;
  _type: "link";
  href: string;
  newTab?: boolean;
};

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  markDefs: PortableTextMarkDef[];
  children: PortableTextSpan[];
};

type DividerBlock = {
  _key: string;
  _type: "divider";
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

export type ContentBlock =
  | PortableTextBlock
  | DividerBlock
  | TableBlock
  | { [key: string]: unknown };

function createKey() {
  return (
    globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 12) ??
    Math.random().toString(36).slice(2, 14)
  );
}

function createSpan(text: string, marks: string[] = []): PortableTextSpan {
  return {
    _type: "span",
    _key: createKey(),
    text,
    marks,
  };
}

function isExternalLink(href: string) {
  return /^(?:https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

function createInlineTextContent(
  text: string,
): Pick<PortableTextBlock, "children" | "markDefs"> {
  const children: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];
  const inlinePattern = /`([^`\n]+)`|(!?)\[([^\]\n]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push(createSpan(text.slice(lastIndex, match.index)));
    }

    if (match[1] !== undefined) {
      children.push(createSpan(match[1], ["code"]));
      lastIndex = inlinePattern.lastIndex;
      continue;
    }

    if (match[2]) {
      children.push(createSpan(match[0]));
      lastIndex = inlinePattern.lastIndex;
      continue;
    }

    const markKey = createKey();
    const href = match[4];
    markDefs.push({
      _key: markKey,
      _type: "link",
      href,
      ...(isExternalLink(href) ? { newTab: true } : {}),
    });
    children.push(createSpan(match[3], [markKey]));
    lastIndex = inlinePattern.lastIndex;
  }

  if (lastIndex < text.length) {
    children.push(createSpan(text.slice(lastIndex)));
  }

  return {
    children: children.length ? children : [createSpan(text)],
    markDefs,
  };
}

function createTextBlock(
  text: string,
  style: "normal" | "h2" | "h3" | "blockquote" = "normal",
  listItem?: "bullet" | "number",
): PortableTextBlock {
  const inlineContent = createInlineTextContent(text);

  return {
    _type: "block",
    _key: createKey(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    ...inlineContent,
  };
}

function joinMarkdownLines(lines: string[]) {
  return lines.map((line) => line.trim()).join(" ");
}

function createDividerBlock(): DividerBlock {
  return {
    _type: "divider",
    _key: createKey(),
  };
}

function isHorizontalRule(line: string) {
  return /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line);
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

export function hasMarkdownTable(lines: string[]) {
  return lines.some(
    (line, index) =>
      isTableRow(line) &&
      lines[index + 1] !== undefined &&
      isTableSeparator(lines[index + 1]),
  );
}

export function hasMarkdownDivider(lines: string[]) {
  return lines.some((line) => isHorizontalRule(line.trim()));
}

export function hasMarkdownInlineCode(lines: string[]) {
  return lines.some((line) => /`[^`\n]+`/.test(line));
}

export function hasMarkdownLink(lines: string[]) {
  return lines.some((line) => /(^|[^!])\[[^\]\n]+\]\([^)\s]+\)/.test(line));
}

export function hasMarkdownBlockquote(lines: string[]) {
  return lines.some((line) => /^\s*>\s*\S/.test(line));
}

export function markdownToPortableTextBlocks(markdown: string): ContentBlock[] {
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

    if (isHorizontalRule(trimmed)) {
      blocks.push(createDividerBlock());
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

      blocks.push(createTextBlock(joinMarkdownLines(quoteLines), "blockquote"));
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      blocks.push(
        createTextBlock(trimmed.replace(/^[-*]\s+/, ""), "normal", "bullet"),
      );
      index += 1;
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      blocks.push(
        createTextBlock(trimmed.replace(/^\d+[.)]\s+/, ""), "normal", "number"),
      );
      index += 1;
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !isHorizontalRule(lines[index].trim()) &&
      !lines[index].trim().startsWith("#") &&
      !lines[index].trim().startsWith(">") &&
      !lines[index].trim().startsWith("```") &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+[.)]\s+/.test(lines[index].trim()) &&
      !(
        isTableRow(lines[index]) &&
        lines[index + 1] !== undefined &&
        isTableSeparator(lines[index + 1])
      )
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(createTextBlock(joinMarkdownLines(paragraphLines)));
  }

  return blocks;
}
