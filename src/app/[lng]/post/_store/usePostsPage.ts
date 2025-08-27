import { create } from "zustand";
import { withDevtools } from "@/store/withDevtools";

interface PostsPageState {
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  reset: () => void;
}

const initialState = {
  inputValue: "",
};

export const usePostsPage = create<PostsPageState>(
  withDevtools(
    (set) => ({
      ...initialState,
      setInputValue: (inputValue: string) => set({ inputValue }),
      reset: () => set(initialState),
    }),
    "PostsPageStore"
  )
);
