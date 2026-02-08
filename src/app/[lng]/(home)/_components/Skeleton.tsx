// 在 page.tsx 引入
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

const skeletonArray = [...Array(4)];

export default function LocaingSkeleton() {
  return (
    <Grid container spacing={2}>
      {skeletonArray.map((_, i) => (
        <Grid size={{ xs: 12, sm: 6 }} key={i}>
          <Skeleton
            variant="rectangular"
            height={360}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "2rem" }} />
          <Skeleton variant="text" width="60%" />
        </Grid>
      ))}
    </Grid>
  );
}
