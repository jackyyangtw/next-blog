// ------------- MUI -------------
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function FilterSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridColumn: { md: "1 / -1" },
        gridTemplateColumns: { md: "14rem minmax(0, 1fr)" },
        width: "100%",
        alignItems: "start",
        gap: { xs: 2, md: 4 },
      }}
    >
      <Skeleton
        height={320}
        sx={{ display: { xs: "none", md: "block" } }}
        variant="rounded"
      />
      <Box sx={{ height: 56, width: { xs: "100%", md: "36rem" } }}>
        <Skeleton
          variant="rectangular"
          height="100%"
          sx={{ borderRadius: 1 }}
        />
      </Box>
      <Skeleton
        height={40}
        sx={{ display: { md: "none" } }}
        variant="rounded"
      />
    </Box>
  );
}
