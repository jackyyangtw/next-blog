"use client";

import { useMutation } from "@tanstack/react-query";

import { generateSeoAction } from "../actions/generateSeoAction";

export function useGenerateSeo() {
  return useMutation({
    mutationFn: generateSeoAction,
    retry: false,
  });
}
