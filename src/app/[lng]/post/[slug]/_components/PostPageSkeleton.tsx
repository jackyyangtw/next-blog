import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function PostPageSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Skeleton variant="text" width="70%" height={48} />
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="rectangular" width="100%" height={320} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="85%" />
    </Box>
  );
}