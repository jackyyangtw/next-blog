// src/lib/api/user/fetch.ts
import { HttpError } from "@/utils/fetch/http-error";

export const fetchUser = async () => {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new HttpError("Failed to fetch user", response.status);
  }
  return response.json();
};
