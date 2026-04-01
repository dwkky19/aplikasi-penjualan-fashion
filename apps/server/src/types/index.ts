import { z } from "zod";

// --- Common ---
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// --- Auth ---
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

export interface AuthSession {
  id: string;
  token: string;
  expiresAt: Date;
}

// --- API Responses ---
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Array<{ field: string; message: string }>;
}
