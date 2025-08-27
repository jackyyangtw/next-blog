import { CategoryDoc } from "@/schema/type/category";

export async function fetchCategories(): Promise<CategoryDoc[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}