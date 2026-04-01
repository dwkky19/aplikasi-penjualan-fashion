import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryService.list(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string }) =>
      categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
