// ------------- MUI -------------
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function FilterSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        width: "100%",
        justifyContent: "space-between",
        alignItems: { xs: "start", md: "center" },
        gap: { xs: 2, md: 4 },
      }}
    >
      {/* 類別標籤的 Skeleton */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        {/* 模擬 All Kind 和 3-4 個隨機長度的分類 */}
        {[80, 100, 90, 110].map((width, index) => (
          <Skeleton
            key={index}
            variant="rectangular" // rectangular 更能貼近 Chip 的形狀
            width={width}
            height={32}
            sx={{ borderRadius: 16 }} // 圓角設定與 Chip 一致
          />
        ))}
      </Box>

      {/* 搜尋框的 Skeleton */}
      <Box sx={{ width: { md: "300px" }, height: 40 }}>
        <Skeleton
          variant="rectangular"
          height="100%"
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </Box>
  );
}
