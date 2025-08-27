"use client";

// ------------- MUI -------------
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

// ------------- Components -------------
import { UserCard } from "./_components/UserCard";
import { BookmarkCard } from "./_components/BookmarkCard";

// ------------- next auth-------------
import { useSession } from "next-auth/react";

// ------------- Tanstack Query -------------
// import { useUser } from "@/lib/api/user/hooks";
import { useBookmarks } from "@/lib/api/bookmarks/hooks";

export default function User() {
  const { data: session, status } = useSession();
  // const { data: user } = useUser();
  const { data: bookmarks } = useBookmarks();
  console.log(bookmarks);

  if (status === "loading") {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>載入中…</Typography>;
  }

  if (!session?.user) {
    return (
      <Card sx={{ maxWidth: 360, mx: "auto", mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center">
            尚未登入
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { name, email, image } = session.user;
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={4} rowSpacing={2} columnSpacing={2}>
          <Stack direction="column" justifyContent="space-between" spacing={2}>
            <UserCard name={name} email={email} image={image} />
          </Stack>
        </Grid>
        <Grid size={8}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            最愛文章
          </Typography>
          <Stack direction="column" justifyContent="space-between" gap={2}>
            {bookmarks?.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
