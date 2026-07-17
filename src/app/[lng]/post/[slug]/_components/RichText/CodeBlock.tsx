"use client";
// theme: https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
// ------------- MUI -------------
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";

// ------------- react -------------
import { useState } from "react";

// ------------- react-syntax-highlighter -------------
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import Stack from "@mui/material/Stack";
import { useCurrentMode } from "@/hooks/MUI/useCurrentMode";
import { readableMaterialDark, readableMaterialLight } from "./syntaxTheme";

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
  const currentMode = useCurrentMode();
  const isDarkMode = currentMode === "dark";
  const syntaxStyle = isDarkMode ? readableMaterialDark : readableMaterialLight;
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        position: "relative",
        mt: 2,
        mb: 5,
        borderRadius: 2,
        overflow: "auto",
        bgcolor: "hsl(220, 35%, 97%)",
        borderColor: alpha(theme.palette.grey[900], 0.14),
        boxShadow: `0 18px 48px ${alpha(theme.palette.grey[900], 0.1)}`,
        px: 2,
        py: 2,
        fontSize: "1rem",
        "& code": {
          fontFamily: "Fira Mono, Menlo, monospace",
        },
        "& code span": {
          opacity: "1 !important",
        },
        ...theme.applyStyles("dark", {
          bgcolor: "hsl(222, 22%, 11%)",
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
        {language && (
          <Typography
            variant="caption"
            sx={(theme) => ({
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
        <Tooltip title={copied ? "已複製！" : "複製"}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={(theme) => ({
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
          style: { background: "transparent" },
        }}
        showLineNumbers
        lineNumberStyle={{
          minWidth: "2.5em",
          color: isDarkMode ? "#c7d2dc" : "#546a73",
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
