import { api } from "../lib/api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const categoryService = {
  list: () => api.get<Category[]>("/api/categories"),

  create: (data: { name: string; slug: string; description?: string }) =>
    api.post<Category>("/api/categories", data),

  update: (id: string, data: Partial<{ name: string; slug: string; description: string }>) =>
    api.patch<Category>(`/api/categories/${id}`, data),

  delete: (id: string) => api.delete(`/api/categories/${id}`),
};
