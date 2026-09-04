"use client";

import { useMutation } from "@tanstack/react-query";

import { reviewArticleAction } from "../actions/reviewArticleAction";

export function useReviewArticle() {
  return useMutation({
    mutationFn: reviewArticleAction,
    retry: false,
  });
}
