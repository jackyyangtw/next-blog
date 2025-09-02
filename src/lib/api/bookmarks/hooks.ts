// hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { fetchBookmarks, addBookmark, removeBookmark } from "./fetch";
import { useSession } from "next-auth/react";

export const useBookmarks = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  return useQuery({
    queryKey: queryKeys.bookmarks,
    queryFn: fetchBookmarks,
    enabled: isAuthenticated,
  });
};

type Bookmark = { post: { _id: string } }; // 依你現有資料結構最小型定義
export const useAddBookmark = () => {
  const queryClient = useQueryClient();
  const key = queryKeys.bookmarks;

  return useMutation({
    mutationKey: ["add-bookmark"],
    mutationFn: (postId: string) => addBookmark(postId),

    // 樂觀更新
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Bookmark[]>(key) ?? [];

      // 先把新收藏塞進快取
      queryClient.setQueryData<Bookmark[]>(key, (old = []) => {
        // 已存在就直接回傳（避免重複）
        if (old.some((b) => b.post._id === postId)) return old;
        return [...old, { post: { _id: postId } }];
      });

      return { previous };
    },

    // 失敗回滾
    onError: (_err, _postId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(key, ctx.previous);
      }
    },

    // 成功或失敗都做一次同步
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();
  const key = queryKeys.bookmarks;

  return useMutation({
    mutationKey: ["remove-bookmark"],
    mutationFn: (postId: string) => removeBookmark(postId),

    // 樂觀更新
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Bookmark[]>(key) ?? [];

      // 先把要刪的從快取移除
      queryClient.setQueryData<Bookmark[]>(key, (old = []) =>
        old.filter((b) => b.post._id !== postId)
      );

      return { previous };
    },

    // 失敗回滾
    onError: (_err, _postId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(key, ctx.previous);
      }
    },

    // 成功或失敗都做一次同步
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
