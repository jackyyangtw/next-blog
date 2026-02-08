// src/app/[lng]/not-found.tsx
"use client";

import Link from "next/link";
// ------------- MUI -------------
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        {/* 圖示部分 */}
        <SearchOffIcon
          sx={{ fontSize: 100, color: "text.secondary", opacity: 0.5 }}
        />

        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            404
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            抱歉，我們找不到這個頁面
          </Typography>
          <Typography variant="body1" color="text.disabled">
            您尋找的文章可能已經刪除，或是網址輸入錯誤。
          </Typography>
        </Box>

        <Button
          variant="contained"
          component={Link}
          href="/"
          size="large"
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1.1rem",
          }}
        >
          返回首頁
        </Button>
      </Box>
    </Container>
  );
}
