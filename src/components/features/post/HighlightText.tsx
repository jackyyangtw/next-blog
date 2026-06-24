import Box from "@mui/material/Box";

interface HighlightTextProps {
  text: string;
  highlight: string;
}

export default function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight.trim()) return <>{text}</>;

  // 使用正則表達式拆分文字，並忽略大小寫
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Box
            key={i}
            component="span"
            sx={{
              // 改用更強烈的對比色
              backgroundColor: "warning.dark", // 使用 MUI 內建的警告深色
              color: "#fff", // 純白文字確保在深色背景上的閱讀品質
              fontWeight: "700",
              borderRadius: "4px", // 稍微加大圓角比較現代
              px: "4px", // 增加左右間距讓文字不擁擠
              mx: "1px", // 與前後文字稍微留一點縫隙
              display: "inline-block", // 確保 padding 生效
              lineHeight: 1.2,
            }}
          >
            {part}
          </Box>
        ) : (
          part
        ),
      )}
    </>
  );
}
