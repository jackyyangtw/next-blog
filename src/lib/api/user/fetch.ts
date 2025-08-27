// src/lib/api/user/fetch.ts
export const fetchUser = async () => {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};