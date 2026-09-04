import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "./fetch";
import { queryKeys } from "../query-keys";

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
};
