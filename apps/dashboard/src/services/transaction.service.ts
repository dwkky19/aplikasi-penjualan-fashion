import { api } from "../lib/api-client";

// ─── Types ───────────────────────────────────────────────

export interface Transaction {
  id: string;
  invoiceNumber: string;
  customerName: string | null;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  paymentMethod: string;
  paymentDetail: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  variant: {
    product: { name: string };
  } | null;
}

export interface TransactionVolume {
  volume: string;
  totalCount: number;
  successCount: number;
  successRate: string;
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

export interface CreateTransactionData {
  invoiceNumber: string;
  customerName?: string;
  paymentMethod: "cash" | "credit_card" | "debit_card" | "qris" | "transfer";
  paymentDetail?: string;
  discount?: string;
  tax?: string;
  notes?: string;
  items: Array<{ variantId: string; quantity: number }>;
}

// ─── Service ─────────────────────────────────────────────

export const transactionService = {
  list: (params?: {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set("search", params.search);
    if (params?.status) sp.set("status", params.status);
    if (params?.dateFrom) sp.set("date_from", params.dateFrom);
    if (params?.dateTo) sp.set("date_to", params.dateTo);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    const qs = sp.toString();
    return api.get<PaginatedResponse<Transaction>>(`/api/transactions${qs ? `?${qs}` : ""}`);
  },

  getVolume: () => api.get<TransactionVolume>("/api/transactions/volume"),

  getById: (id: string) => api.get<Transaction>(`/api/transactions/${id}`),

  create: (data: CreateTransactionData) =>
    api.post<Transaction>("/api/transactions", data),

  processReturn: (id: string) =>
    api.post<{ message: string }>(`/api/transactions/${id}/return`),

  getExportUrl: (params?: { dateFrom?: string; dateTo?: string }) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const sp = new URLSearchParams();
    if (params?.dateFrom) sp.set("date_from", params.dateFrom);
    if (params?.dateTo) sp.set("date_to", params.dateTo);
    const qs = sp.toString();
    return `${baseUrl}/api/transactions/export${qs ? `?${qs}` : ""}`;
  },
};
