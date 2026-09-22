import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface PostSkeletonProps {
  count?: number;
}

export default function PostSkeleton({ count = 4 }: PostSkeletonProps) {
  return (
    <Grid aria-hidden="true" container spacing={3}>
      {Array.from({ length: count }, (_, index) => (
        <Grid key={index} size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Box
              sx={{
                aspectRatio: "16 / 9",
                borderBottom: "1px solid",
                borderColor: "divider",
                width: "100%",
              }}
            >
              <Skeleton height="100%" variant="rectangular" width="100%" />
            </Box>

            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                p: 2,
                "&:last-child": { pb: 2 },
              }}
            >
              <Box sx={{ minHeight: "3.2em", mb: 0.75 }}>
                <Skeleton height={24} width="94%" />
                <Skeleton height={24} width="68%" />
              </Box>

              <Stack
                alignItems="center"
                direction="row"
                mb={2}
                spacing={1}
                sx={{ height: 32, overflow: "hidden" }}
              >
                <Skeleton height={24} variant="rounded" width={88} />
                <Skeleton height={24} variant="rounded" width={72} />
              </Stack>

              <Box>
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="84%" />
              </Box>
            </CardContent>

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Stack alignItems="center" direction="row" spacing={1}>
                <Skeleton height={24} variant="circular" width={24} />
                <Skeleton height={14} width={48} />
              </Stack>
              <Skeleton height={14} width={72} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
