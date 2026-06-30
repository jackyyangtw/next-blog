"use client";

import { useState, type ReactNode } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useAppSnackbarStore } from "@/store/useAppSnackbarStore";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : () => null;

const ONE_MINUTE = 1000 * 60;

const getErrorStatus = (error: unknown) => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
};

const shouldRetry = (failureCount: number, error: unknown) => {
  const status = getErrorStatus(error);

  if (status && status >= 400 && status < 500) return false;
  return failureCount < 2;
};

const showErrorSnackbar = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  useAppSnackbarStore.getState().showSnackbar({
    message,
    severity: "error",
  });
};

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE,
        gcTime: ONE_MINUTE * 10,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data !== undefined) {
          showErrorSnackbar(error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: showErrorSnackbar,
    }),
  });

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
