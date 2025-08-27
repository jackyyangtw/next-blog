// FavoriteButton.tsx
"use client";

import React from "react";

// ------------- MUI -------------
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// ------------- React Query -------------
import {
  useBookmarks,
  useAddBookmark,
  useRemoveBookmark,
} from "@/lib/api/bookmarks/hooks";

// ------------- next -------------
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ------------- store -------------
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";

interface FavoriteButtonProps {
  postId: string;
}

export default function FavoriteButton({ postId }: FavoriteButtonProps) {
  const { showSnackbar } = useAppSnackbarStore();
  const { status } = useSession();
  const router = useRouter();

  // --------------- isFavorite ---------------
  const { data: bookmarks } = useBookmarks();
  const isFavorite = React.useMemo(() => {
    if (!bookmarks) return false;
    return bookmarks.some((b) => b.post._id === postId);
  }, [bookmarks, postId]);

  // --------------- Mutation ---------------
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const isMutating = addBookmark.isPending || removeBookmark.isPending;
  // 受控 tooltip，mutation 期間強制關閉
  const [tipOpen, setTipOpen] = React.useState(false);
  const handleToggle = () => {
    if (status === "unauthenticated") {
      showSnackbar({ message: "請先登入", severity: "warning" });
      router.push("/auth");
      return;
    }
    if (isMutating) return; // 忽略連點

    // 點擊就先把 tooltip 關掉，避免殘留
    setTipOpen(false);

    if (isFavorite) {
      removeBookmark.mutate(postId, {
        onSuccess: () =>
          showSnackbar({ message: "已從最愛中移除", severity: "success" }),
        onError: (error) =>
          showSnackbar({ message: error.message, severity: "error" }),
      });
    } else {
      addBookmark.mutate(postId, {
        onSuccess: () =>
          showSnackbar({ message: "已加入最愛", severity: "success" }),
        onError: (error) =>
          showSnackbar({ message: error.message, severity: "error" }),
      });
    }
  };

  return (
    <Tooltip
      title={isFavorite ? "已加入最愛" : "加入最愛"}
      placement="top"
      open={isMutating ? false : tipOpen}
      onOpen={() => setTipOpen(true)}
      onClose={() => setTipOpen(false)}
      disableHoverListener={isMutating}
      disableFocusListener={isMutating}
      disableTouchListener={isMutating}
    >
      <IconButton
        color={isFavorite ? "primary" : "default"}
        onClick={handleToggle}
        aria-label={isFavorite ? "移除最愛" : "加入最愛"}
        // disabled={isBookmarksLoading}
        sx={{ ml: 1 }}
      >
        {isFavorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}
