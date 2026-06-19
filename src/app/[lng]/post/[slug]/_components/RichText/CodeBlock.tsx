"use client";
// theme: https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
// ------------- MUI -------------
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { alpha, useTheme } from "@mui/material/styles";

// ------------- react -------------
import { useState } from "react";

// ------------- react-syntax-highlighter -------------
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import Stack from "@mui/material/Stack";

const readableMaterialLight = {
  ...materialLight,
  'code[class*="language-"]': {
    ...materialLight['code[class*="language-"]'],
    color: "#5f7680",
  },
  'pre[class*="language-"]': {
    ...materialLight['pre[class*="language-"]'],
    color: "#5f7680",
  },
  comment: {
    ...materialLight.comment,
    color: "#6f8791",
  },
  doctype: {
    ...materialLight.doctype,
    color: "#6f8791",
  },
  prolog: {
    ...materialLight.prolog,
    color: "#6f8791",
  },
  punctuation: {
    ...materialLight.punctuation,
    color: "#1f9aa4",
  },
  keyword: {
    ...materialLight.keyword,
    color: "#6747d9",
  },
  function: {
    ...materialLight.function,
    color: "#6747d9",
  },
  constant: {
    ...materialLight.constant,
    color: "#6747d9",
  },
  boolean: {
    ...materialLight.boolean,
    color: "#6747d9",
  },
};

export function RichTextCodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const theme = useTheme();
  const syntaxStyle =
    theme.palette.mode === "dark" ? materialDark : readableMaterialLight;
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        position: "relative",
        mt: 2,
        mb: 5,
        borderRadius: 2,
        overflow: "auto",
        bgcolor: "hsl(220, 24%, 92%)",
        borderColor: alpha(theme.palette.grey[900], 0.1),
        boxShadow: `0 18px 48px ${alpha(theme.palette.grey[900], 0.1)}`,
        px: 2,
        py: 2,
        fontSize: "1rem",
        // "& pre": {
        //   m: 0,
        //   p: 0,
        //   // bgcolor: "transparent",
        //   fontFamily: "Fira Mono, Menlo, monospace",
        //   // 自訂 scrollbar
        //   "&::-webkit-scrollbar": {
        //     height: 8,
        //     background: "#222",
        //   },
        //   "&::-webkit-scrollbar-thumb": {
        //     background: "#444",
        //     borderRadius: 4,
        //   },
        // },
        "& code": {
          fontFamily: "Fira Mono, Menlo, monospace",
        },
        ...theme.applyStyles("dark", {
          bgcolor: "hsl(222, 28%, 8%)",
          borderColor: alpha(theme.palette.common.white, 0.1),
          boxShadow: `0 18px 48px ${alpha(theme.palette.common.black, 0.26)}`,
        }),
      })}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        gap={1}
      >
        {/* 語言標籤 */}
        {language && (
          <Typography
            variant="caption"
            sx={(theme) => ({
              // position: "absolute",
              // top: 15,
              // right: 48,
              bgcolor: alpha(theme.palette.grey[900], 0.82),
              color: "grey.50",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              zIndex: 1,
              opacity: 0.85,
              pointerEvents: "none",
              ...theme.applyStyles("dark", {
                bgcolor: alpha(theme.palette.common.white, 0.08),
                color: "grey.200",
              }),
            })}
          >
            {language}
          </Typography>
        )}
        {/* 複製按鈕 */}
        <Tooltip title={copied ? "已複製！" : "複製"}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={(theme) => ({
              // position: "absolute",
              // top: 10,
              // right: 10,
              zIndex: 2,
              color: "grey.50",
              bgcolor: alpha(theme.palette.grey[900], 0.86),
              borderColor: alpha(theme.palette.grey[900], 0.08),
              "&:hover": { bgcolor: "grey.800" },
              ...theme.applyStyles("dark", {
                color: "grey.200",
                bgcolor: alpha(theme.palette.common.white, 0.08),
                borderColor: alpha(theme.palette.common.white, 0.1),
                "&:hover": {
                  bgcolor: alpha(theme.palette.common.white, 0.14),
                },
              }),
            })}
          >
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Stack>
      {/* 程式碼 */}
      <SyntaxHighlighter
        language={language}
        style={syntaxStyle}
        customStyle={{
          margin: 0,
          background: "inherit",
          padding: "0 1.5rem 0 0.5rem",
          fontSize: "1rem",
        }}
        codeTagProps={{
          style: { background: "transparent" }, // 這裡也加一層保險
        }}
        showLineNumbers
        lineNumberStyle={{
          minWidth: "2.5em",
          color: theme.palette.mode === "dark" ? "#8b9aa3" : "#78909c",
          // background: "#222",
          paddingRight: "0.5em",
          marginRight: "1em",
          fontSize: "0.95em",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Paper>
  );
}
