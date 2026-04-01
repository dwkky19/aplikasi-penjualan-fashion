import { api } from "../lib/api-client";

// ─── Types ───────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
  minStock: number;
  maxStock: number;
  priceOverride: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: string;
  costPrice: string | null;
  categoryId: string | null;
  supplierId: string | null;
  collection: string | null;
  isFeatured: boolean;
  isNewSeason: boolean;
  status: "active" | "archived" | "draft";
  createdAt: string;
  updatedAt: string;
  category: Category | null;
  variants: ProductVariant[];
  images: ProductImage[];
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

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  basePrice: string;
  costPrice?: string;
  categoryId?: string;
  supplierId?: string;
  collection?: string;
  isFeatured?: boolean;
  isNewSeason?: boolean;
}

export interface CreateVariantData {
  sku: string;
  size?: string;
  color?: string;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  priceOverride?: string;
}

// ─── Service ─────────────────────────────────────────────

export const productService = {
  list: (params?: {
    category?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return api.get<PaginatedResponse<Product>>(`/api/products${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    api.get<Product>(`/api/products/${id}`),

  create: (data: CreateProductData) =>
    api.post<Product>("/api/products", data),

  update: (id: string, data: Partial<CreateProductData>) =>
    api.patch<Product>(`/api/products/${id}`, data),

  archive: (id: string) =>
    api.delete<{ message: string; product: Product }>(`/api/products/${id}`),

  createVariant: (productId: string, data: CreateVariantData) =>
    api.post<ProductVariant>(`/api/products/${productId}/variants`, data),

  updateVariant: (productId: string, variantId: string, data: Partial<CreateVariantData>) =>
    api.patch<ProductVariant>(`/api/products/${productId}/variants/${variantId}`, data),

  deleteVariant: (productId: string, variantId: string) =>
    api.delete(`/api/products/${productId}/variants/${variantId}`),

  addImage: (productId: string, data: { url: string; altText?: string; isPrimary?: boolean }) =>
    api.post<ProductImage>(`/api/products/${productId}/images`, data),
};
