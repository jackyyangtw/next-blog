import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function PostDetailPageSkeleton() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
      }}
    >
      <Box mb={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={3}
          mb={2}
        >
          <Skeleton
            variant="text"
            width="72%"
            height={58}
            sx={{ transformOrigin: "left top" }}
          />
          <Skeleton
            variant="rounded"
            width={40}
            height={40}
            sx={{ flexShrink: 0, borderRadius: 1.5 }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" gap={0.75} mb={3}>
          <Skeleton variant="rounded" width={16} height={16} />
          <Skeleton variant="text" width={96} height={22} />
        </Stack>

        <Stack gap={0.5}>
          <Skeleton variant="text" width="86%" height={28} />
          <Skeleton
            variant="text"
            height={28}
            sx={{ width: { xs: "62%", md: "44%" } }}
          />
        </Stack>
      </Box>

      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          aspectRatio: { xs: "16 / 9", md: "21 / 9" },
          borderRadius: 2,
          mb: 6,
        }}
      />

      <Stack gap={1.25}>
        <Skeleton variant="text" width="96%" height={24} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="91%" height={24} />
        <Skeleton variant="text" width="76%" height={24} />
      </Stack>
    </Box>
  );
}
