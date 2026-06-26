import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export const readableMaterialLight = {
  ...materialLight,
  'code[class*="language-"]': {
    ...materialLight['code[class*="language-"]'],
    color: "#24343b",
  },
  'pre[class*="language-"]': {
    ...materialLight['pre[class*="language-"]'],
    color: "#24343b",
  },
  comment: {
    ...materialLight.comment,
    color: "#546a73",
  },
  doctype: {
    ...materialLight.doctype,
    color: "#546a73",
  },
  prolog: {
    ...materialLight.prolog,
    color: "#546a73",
  },
  punctuation: {
    ...materialLight.punctuation,
    color: "#087f8c",
  },
  keyword: {
    ...materialLight.keyword,
    color: "#5b35d5",
  },
  function: {
    ...materialLight.function,
    color: "#5b35d5",
  },
  constant: {
    ...materialLight.constant,
    color: "#5b35d5",
  },
  boolean: {
    ...materialLight.boolean,
    color: "#5b35d5",
  },
  namespace: {
    ...materialLight.namespace,
    color: "#5d7480",
  },
  operator: {
    ...materialLight.operator,
    color: "#087f8c",
  },
};

export const readableMaterialDark = {
  ...materialDark,
  token: {
    color: "#dbeafe",
    opacity: 1,
    Opacity: 1,
  },
  '[class*="language-"] .namespace': {
    color: "#dbeafe",
    opacity: 1,
    Opacity: 1,
  },
  'code[class*="language-"]': {
    ...materialDark['code[class*="language-"]'],
    color: "#dbeafe",
  },
  'pre[class*="language-"]': {
    ...materialDark['pre[class*="language-"]'],
    color: "#dbeafe",
  },
  comment: {
    ...materialDark.comment,
    color: "#bfd0dc",
  },
  doctype: {
    ...materialDark.doctype,
    color: "#bfd0dc",
  },
  prolog: {
    ...materialDark.prolog,
    color: "#bfd0dc",
  },
  punctuation: {
    ...materialDark.punctuation,
    color: "#6ee7f0",
  },
  keyword: {
    ...materialDark.keyword,
    color: "#b997ff",
  },
  function: {
    ...materialDark.function,
    color: "#b997ff",
  },
  constant: {
    ...materialDark.constant,
    color: "#b997ff",
  },
  boolean: {
    ...materialDark.boolean,
    color: "#b997ff",
  },
  namespace: {
    ...materialDark.namespace,
    color: "#adc2cc",
  },
  operator: {
    ...materialDark.operator,
    color: "#7dd3fc",
  },
  property: {
    ...materialDark.property,
    color: "#ffdf80",
  },
  string: {
    ...materialDark.string,
    color: "#c5f57a",
  },
  variable: {
    ...materialDark.variable,
    color: "#dbeafe",
  },
  parameter: {
    ...materialDark.parameter,
    color: "#dbeafe",
  },
  "attr-name": {
    ...materialDark["attr-name"],
    color: "#c7d2fe",
  },
  "class-name": {
    ...materialDark["class-name"],
    color: "#c7d2fe",
  },
  selector: {
    ...materialDark.selector,
    color: "#c7d2fe",
  },
  tag: {
    ...materialDark.tag,
    color: "#c7d2fe",
  },
  number: {
    ...materialDark.number,
    color: "#fbbf8f",
  },
  literal: {
    ...materialDark.literal,
    color: "#fbbf8f",
  },
  builtin: {
    ...materialDark.builtin,
    color: "#7dd3fc",
  },
  symbol: {
    ...materialDark.symbol,
    color: "#7dd3fc",
  },
  deleted: {
    ...materialDark.deleted,
    color: "#fca5a5",
  },
  inserted: {
    ...materialDark.inserted,
    color: "#c5f57a",
  },
};
