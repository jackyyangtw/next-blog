type PortableTextChild = {
  text?: unknown;
};

type PortableTextBlock = {
  _type?: unknown;
  children?: PortableTextChild[];
  code?: unknown;
  rows?: {
    cells?: {
      text?: unknown;
    }[];
  }[];
};

function isPortableTextBlock(value: unknown): value is PortableTextBlock {
  return typeof value === "object" && value !== null;
}

function blockToText(block: PortableTextBlock) {
  if (block._type === "code" && typeof block.code === "string") {
    return block.code;
  }

  if (block._type === "table" && Array.isArray(block.rows)) {
    return block.rows
      .map((row) =>
        row.cells
          ?.map((cell) => (typeof cell.text === "string" ? cell.text : ""))
          .filter(Boolean)
          .join(" "),
      )
      .filter(Boolean)
      .join("\n");
  }

  if (!Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("");
}

export function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .filter(isPortableTextBlock)
    .map(blockToText)
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
