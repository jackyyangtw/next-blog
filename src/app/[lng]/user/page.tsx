"use client";

// ------------- MUI -------------
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

// ------------- Components -------------
import UserCard from "./_components/UserCard";
import BookmarkCard from "./_components/BookmarkCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// ------------- next auth-------------
import { useSession } from "next-auth/react";

// ------------- Tanstack Query -------------
import { useBookmarks } from "@/lib/api/bookmarks/hooks";

// ------------- i18n -------------
import { useClientTranslation } from "@/i18n/client";

export default function User() {
  const { data: session, status } = useSession();
  const { data: bookmarks, isPending } = useBookmarks();
  const { t } = useClientTranslation("user-page");
  if (status === "loading") {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>{t("loading_user")}</Typography>;
  }

  return (
    <ProtectedRoute>
      <Grid container spacing={5}>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <UserCard
            name={session?.user?.name}
            email={session?.user?.email}
            image={session?.user?.image}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t("bookmark")}
          </Typography>
          {bookmarks && bookmarks.length > 0 && (
            <Stack direction="column" justifyContent="space-between" gap={2}>
              {bookmarks?.map((bookmark) => (
                <BookmarkCard key={bookmark._id} bookmark={bookmark} />
              ))}
            </Stack>
          )}
          {bookmarks && bookmarks.length === 0 && !isPending && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("no_bookmark")}
            </Typography>
          )}
          {isPending && <CircularProgress />}
        </Grid>
      </Grid>
    </ProtectedRoute>
  );
}
