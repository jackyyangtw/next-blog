import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "./fetch";
import { queryKeys } from "../query-keys";

export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: fetchUser,
  });
};
