import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventory.service";
import { productKeys } from "./useProducts";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...inventoryKeys.lists(), params] as const,
  stats: () => [...inventoryKeys.all, "stats"] as const,
  logs: (params: Record<string, unknown>) => [...inventoryKeys.all, "logs", params] as const,
  shipments: () => [...inventoryKeys.all, "shipments"] as const,
};

export function useInventory(params?: {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: inventoryKeys.list(params || {}),
    queryFn: () => inventoryService.list(params),
  });
}

export function useInventoryStats() {
  return useQuery({
    queryKey: inventoryKeys.stats(),
    queryFn: () => inventoryService.getStats(),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data }: { variantId: string; data: { newStock: number; notes: string } }) =>
      inventoryService.adjustStock(variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useInventoryLogs(params?: { variantId?: string; type?: string; page?: number }) {
  return useQuery({
    queryKey: inventoryKeys.logs(params || {}),
    queryFn: () => inventoryService.getLogs(params),
  });
}

export function useShipments() {
  return useQuery({
    queryKey: inventoryKeys.shipments(),
    queryFn: () => inventoryService.getShipments(),
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof inventoryService.createPurchaseOrder>[0]) =>
      inventoryService.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.shipments() });
    },
  });
}

export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      inventoryService.updatePurchaseOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.shipments() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stats() });
    },
  });
}
