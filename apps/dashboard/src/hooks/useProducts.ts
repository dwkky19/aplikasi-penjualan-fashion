import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, type CreateProductData, type CreateVariantData } from "../services/product.service";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(params?: {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productService.list(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductData) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductData> }) =>
      productService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useCreateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateVariantData }) =>
      productService.createVariant(productId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
