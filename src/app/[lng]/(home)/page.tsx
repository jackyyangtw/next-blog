// src/app/[lng]/(home)/page.tsx

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ------------- Components -------------
import PostsSection from "./_components/PostSection";

export default async function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Blog
        </Typography>
        <Typography>
          Stay in the loop with the latest about our products
        </Typography>
      </Box>
      <PostsSection />
    </Box>
  );
}
