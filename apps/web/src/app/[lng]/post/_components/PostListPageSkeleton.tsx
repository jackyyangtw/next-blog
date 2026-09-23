import Box from "@mui/material/Box";

import FilterSkeleton from "./FilterSkeleton";

export default function PostListPageSkeleton() {
  return (
    <Box
      sx={{
        left: { md: "50%" },
        minWidth: 0,
        position: { md: "relative" },
        transform: { md: "translateX(-50%)" },
        width: { xs: "100%", md: "min(1440px, calc(100vw - 4rem))" },
      }}
    >
      <FilterSkeleton />
    </Box>
  );
}
