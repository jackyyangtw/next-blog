"use client";
// theme: https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
// ------------- MUI -------------
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

// ------------- react -------------
import { useState } from "react";

// ------------- react-syntax-highlighter -------------
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import Stack from "@mui/material/Stack";

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
    theme.palette.mode === "dark" ? materialDark : materialLight;
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        my: 2,
        borderRadius: 2,
        overflow: "auto",
        // bgcolor: "background.default",
        boxShadow: 2,
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
      }}
    >
      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1}>
        {/* 語言標籤 */}
        {language && (
          <Typography
            variant="caption"
            sx={{
              // position: "absolute",
              // top: 15,
              // right: 48,
              bgcolor: "grey.900",
              color: "grey.100",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              zIndex: 1,
              opacity: 0.85,
              pointerEvents: "none",
            }}
          >
            {language}
          </Typography>
        )}
        {/* 複製按鈕 */}
        <Tooltip title={copied ? "已複製！" : "複製"}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              // position: "absolute",
              // top: 10,
              // right: 10,
              zIndex: 2,
              color: "grey.300",
              bgcolor: "grey.900",
              "&:hover": { bgcolor: "grey.800" },
            }}
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
          // color: "#888",
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
