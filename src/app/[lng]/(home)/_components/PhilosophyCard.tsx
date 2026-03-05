// 1. 技術堅持卡片元件 - 使用 Theme 中的灰階與品牌色
import { Card, CardContent, Stack, Box, Typography, alpha } from "@mui/material";
import { SvgIconProps } from "@mui/material";

interface PhilosophyCardProps {
  title: string;
  icon: React.ElementType<SvgIconProps>;
  description: string;
  code: string;
}
export default function PhilosophyCard({ title, icon: Icon, description, code }: PhilosophyCardProps) {
  return (
  <Card
    sx={{
      height: "100%",
      bgcolor: "background.paper", // 使用 hsl(220, 30%, 7%)
      backgroundImage: "none", // 移除 MUI Paper 預設的疊加層
      border: "1px solid",
      borderColor: "divider",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        borderColor: "primary.main", // 使用 brand[400]
        transform: "translateY(-4px)",
        boxShadow: (theme) => theme.shadows[2], // 使用你自定義的 brand 陰影
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 1,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            borderRadius: 1.5,
            display: "flex",
          }}
        >
          <Icon sx={{ color: "primary.light" }} fontSize="small" />
        </Box>
        <Typography
          variant="h6"
          sx={{ color: "text.primary", fontSize: "1.1rem" }}
        >
          {title}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 3, lineHeight: 1.7 }}
      >
        {description}
      </Typography>
      <Box
        sx={(theme) => ({
          p: 2,
          borderRadius: 1,
          fontFamily: "monospace",
          fontSize: "0.75rem",
          color:
            theme.palette.mode === "dark" ? "primary.light" : "primary.dark",
          border: "1px solid",
          borderColor: "divider",
        })}
      >
        {code}
      </Box>
    </CardContent>
  </Card>
  );
};