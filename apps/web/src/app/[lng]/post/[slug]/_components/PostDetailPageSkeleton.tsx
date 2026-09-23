import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface PostDetailPageSkeletonProps {
  showCategories?: boolean;
  showScrollSpy?: boolean;
}

export default function PostDetailPageSkeleton({
  showCategories = true,
  showScrollSpy = true,
}: PostDetailPageSkeletonProps) {
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
            height={40}
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

        <Stack gap={1} mb={3}>
          <Skeleton variant="text" width="86%" height={28} />
          <Skeleton
            variant="text"
            height={28}
            sx={{ width: { xs: "62%", md: "44%" } }}
          />
        </Stack>

        {showCategories && (
          <Stack direction="row" gap={1} flexWrap="wrap">
            {[64, 92, 116, 68].map((width) => (
              <Skeleton
                key={width}
                variant="rounded"
                width={width}
                height={20}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          aspectRatio: { xs: "16 / 9", md: "21 / 9" },
          borderRadius: 2,
          mb: 6,
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />
      </Box>

      <Box sx={{ display: { xs: "block", lg: "flex" }, gap: { lg: 4, xl: 5 } }}>
        <Stack gap={1.25} sx={{ flex: 1, minWidth: 0, minHeight: 400 }}>
          <Skeleton variant="text" width="96%" height={24} />
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="91%" height={24} />
          <Skeleton variant="text" width="76%" height={24} />
          <Skeleton variant="text" width="88%" height={24} />
        </Stack>
        {showScrollSpy && (
          <Stack
            gap={1.5}
            sx={{
              display: { xs: "none", lg: "flex" },
              flexShrink: 0,
              width: 240,
            }}
          >
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="72%" height={24} />
            <Skeleton variant="text" width="82%" height={24} />
          </Stack>
        )}
      </Box>
    </Box>
  );
}
