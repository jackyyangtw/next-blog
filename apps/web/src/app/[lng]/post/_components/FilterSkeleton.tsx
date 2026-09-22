// ------------- MUI -------------
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import PostSkeleton from "./PostSkeleton";

const CATEGORY_ROW_WIDTHS = ["72%", "58%", "82%", "64%", "76%"];

export default function FilterSkeleton() {
  return (
    <Box
      aria-busy="true"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 4 },
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          alignSelf: { md: "flex-start" },
          flex: { md: "0 0 16rem" },
          order: { xs: 2, md: 0 },
          position: { md: "sticky" },
          top: { md: 96 },
        }}
      >
        <Box
          sx={{
            backgroundColor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            height: "calc(100dvh - 10.5rem)",
            minHeight: 0,
            overflow: "hidden",
            p: 1,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 1,
              mb: 1,
              px: 1.5,
              py: 1,
            }}
          >
            <Skeleton height={20} variant="circular" width={20} />
            <Skeleton height={24} width={128} />
          </Box>
          <Stack spacing={0.5} sx={{ px: 1, py: 0.5 }}>
            {CATEGORY_ROW_WIDTHS.map((width, index) => (
              <Box
                key={width}
                sx={{
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: index === 0 ? "divider" : "transparent",
                  borderRadius: 1,
                  display: "flex",
                  gap: 1.5,
                  minHeight: 48,
                  px: 1,
                }}
              >
                {index === 0 ? (
                  <Skeleton height={20} variant="circular" width={20} />
                ) : null}
                <Skeleton height={20} width={width} />
              </Box>
            ))}
          </Stack>
        </Box>
        <Skeleton
          height={40}
          sx={{ display: { md: "none" }, maxWidth: 160 }}
          variant="rounded"
        />
      </Box>

      <Box
        sx={{
          display: { xs: "contents", md: "flex" },
          flex: { md: 1 },
          flexDirection: "column",
          gap: { md: 4 },
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            order: { xs: 1 },
            width: { xs: "100%", md: "36rem" },
          }}
        >
          <Skeleton height={16} width={72} />
          <Skeleton
            height={40}
            sx={{ borderRadius: 2, mt: 0.75 }}
            variant="rectangular"
            width="100%"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
            order: { xs: 3 },
          }}
        >
          <PostSkeleton count={2} />
        </Box>
      </Box>
    </Box>
  );
}
