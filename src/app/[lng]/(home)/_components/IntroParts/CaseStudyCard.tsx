import type { SvgIconProps } from "@mui/material";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

interface CaseStudyCardProps {
  title: string;
  description: string;
  tags: string[];
  icon: React.ElementType<SvgIconProps>;
}

export default function CaseStudyCard({
  title,
  description,
  tags,
  icon: Icon,
}: CaseStudyCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderColor: "divider",
        transition: "border-color 0.25s ease, transform 0.25s ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "action.selected",
              borderRadius: 1.5,
              display: "flex",
            }}
          >
            <Icon sx={{ color: "primary.main" }} fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontSize: "1.05rem" }}>
            {title}
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.75, mb: 3 }}
        >
          {description}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {tags.map((tag) => (
            <Box
              component="span"
              key={tag}
              sx={{
                px: 1.2,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                color: "text.secondary",
                fontSize: "0.75rem",
                fontFamily: "monospace",
              }}
            >
              {tag}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
