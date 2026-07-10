import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { SvgIconProps } from "@mui/material";

interface PhilosophyCardProps {
  title: string;
  icon: React.ElementType<SvgIconProps>;
  description: string;
  code: string;
}

export default function PhilosophyCard({
  title,
  icon: Icon,
  description,
  code,
}: PhilosophyCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        minWidth: 0,
        width: "100%",
        bgcolor: "background.paper",
        backgroundImage: "none",
        border: "1px solid",
        borderColor: "divider",
        transition:
          "border-color 260ms ease, box-shadow 260ms ease, transform 260ms ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-4px)",
          boxShadow: 2,
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            transform: "none",
          },
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
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 1,
            fontFamily: "monospace",
            fontSize: "0.75rem",
            overflowWrap: "anywhere",
            color: "primary.dark",
            ".dark &": {
              color: "primary.light",
            },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {code}
        </Box>
      </CardContent>
    </Card>
  );
}
