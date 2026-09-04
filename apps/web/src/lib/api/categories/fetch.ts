import { CategoryDoc } from "@/schema/type/category";
import { HttpError } from "@/utils/fetch/http-error";

export async function fetchCategories(): Promise<CategoryDoc[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new HttpError("Failed to fetch categories", res.status);
  return res.json();
}
