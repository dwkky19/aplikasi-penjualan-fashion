import { api } from "../lib/api-client";

// ─── Types ───────────────────────────────────────────────

export interface InventoryItem {
  variantId: string;
  productId: string;
  productName: string;
  collection: string | null;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
  minStock: number;
  maxStock: number;
  categoryName: string | null;
  supplierName: string | null;
  updatedAt: string;
  imageUrl: string | null;
}

export interface InventoryStats {
  totalProducts: number;
  totalVariants: number;
  outOfStock: number;
  lowStock: number;
  totalValuation: string;
}

export interface InventoryLog {
  id: string;
  type: string;
  quantityChange: number;
  stockAfter: number;
  notes: string | null;
  createdAt: string;
  variant: {
    product: { name: string };
  };
  createdByUser: { name: string } | null;
}

export interface Shipment {
  id: string;
  orderNumber: string;
  status: string;
  expectedDate: string | null;
  totalCost: string;
  supplier: { id: string; name: string };
  items: Array<{
    quantity: number;
    variant: { product: { name: string } };
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Service ─────────────────────────────────────────────

export const inventoryService = {
  list: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params?.category) sp.set("category", params.category);
    if (params?.status) sp.set("status", params.status);
    if (params?.search) sp.set("search", params.search);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    const qs = sp.toString();
    return api.get<PaginatedResponse<InventoryItem>>(`/api/inventory${qs ? `?${qs}` : ""}`);
  },

  getStats: () => api.get<InventoryStats>("/api/inventory/stats"),

  adjustStock: (variantId: string, data: { newStock: number; notes: string }) =>
    api.patch<{ variantId: string; previousStock: number; newStock: number }>(
      `/api/inventory/${variantId}/adjust`,
      data
    ),

  getLogs: (params?: { variantId?: string; type?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.variantId) sp.set("variant_id", params.variantId);
    if (params?.type) sp.set("type", params.type);
    if (params?.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return api.get<InventoryLog[]>(`/api/inventory/logs${qs ? `?${qs}` : ""}`);
  },

  getShipments: () => api.get<Shipment[]>("/api/inventory/shipments"),

  createPurchaseOrder: (data: {
    orderNumber: string;
    supplierId: string;
    expectedDate?: string;
    notes?: string;
    items: Array<{ variantId: string; quantity: number; unitCost: string }>;
  }) => api.post("/api/inventory/purchase-orders", data),

  updatePurchaseOrderStatus: (id: string, status: string) =>
    api.patch(`/api/inventory/purchase-orders/${id}`, { status }),
};
