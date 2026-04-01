import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService, type CreateTransactionData } from "../services/transaction.service";
import { inventoryKeys } from "./useInventory";
import { dashboardKeys } from "./useDashboard";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...transactionKeys.lists(), params] as const,
  detail: (id: string) => [...transactionKeys.all, "detail", id] as const,
  volume: () => [...transactionKeys.all, "volume"] as const,
};

export function useTransactions(params?: {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: transactionKeys.list(params || {}),
    queryFn: () => transactionService.list(params),
  });
}

export function useTransactionVolume() {
  return useQuery({
    queryKey: transactionKeys.volume(),
    queryFn: () => transactionService.getVolume(),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.volume() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useProcessReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionService.processReturn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.volume() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
