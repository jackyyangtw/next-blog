// src/store/withDevTools.ts
import { devtools } from "zustand/middleware";
import type { StateCreator } from "zustand";

export const withDevtools =
  <T>(fn: StateCreator<T>, storeName: string): StateCreator<T> =>
  (set, get, api) => {
    if (process.env.NODE_ENV !== "production") {
      return devtools(fn, {
        name: storeName,
        store: storeName,
      })(set, get, api);
    }
    return fn(set, get, api);
  };
