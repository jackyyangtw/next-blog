// src/app/[lng]/(home)/_components/Author.tsx

// ------------- MUI -------------
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

// ------------- Sanity -------------
import { urlFor } from "@/sanity/lib/image";

// ------------- Schema -------------
import { AuthorDoc } from "@/schema/type/author";
import { PostSummary } from "@/schema/type/post";

// ------------- Dayjs -------------
import dayjs from "dayjs";

export default function Author({
  authors,
  post,
}: {
  authors: AuthorDoc;
  post: Pick<PostSummary, "_createdAt">;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Avatar
          alt={authors.name}
          src={authors.avatar ? urlFor(authors.avatar).url() : undefined}
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="caption">{authors.name}</Typography>
      </Box>
      <Typography variant="caption">
        {dayjs(post._createdAt).format("YYYY/MM/DD")}
      </Typography>
    </Box>
  );
}
