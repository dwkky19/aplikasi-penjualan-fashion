import { db } from "../db/index.js";
import {
  products,
  productVariants,
  productImages,
} from "../db/schema.js";
import { eq, ilike, desc, sql, and, or } from "drizzle-orm";

export const productService = {
  /**
   * List products with optional filtering, pagination.
   */
  async list(params: {
    category?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (params.search) {
      conditions.push(
        or(
          ilike(products.name, `%${params.search}%`),
          ilike(products.slug, `%${params.search}%`)
        )
      );
    }

    if (params.category) {
      conditions.push(eq(products.categoryId, params.category));
    }

    if (params.status) {
      conditions.push(
        eq(products.status, params.status as "active" | "archived" | "draft")
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db.query.products.findMany({
        where,
        with: {
          category: { columns: { id: true, name: true, slug: true } },
          variants: true,
          images: { orderBy: [productImages.sortOrder] },
        },
        orderBy: [desc(products.createdAt)],
        limit,
        offset,
      }),
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(products)
        .where(where),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: countResult[0]?.count || 0,
        totalPages: Math.ceil((countResult[0]?.count || 0) / limit),
      },
    };
  },

  /**
   * Get single product by ID with variants and images.
   */
  async getById(id: string) {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        supplier: true,
        variants: true,
        images: { orderBy: [productImages.sortOrder] },
      },
    });
  },

  /**
   * Create a new product.
   */
  async create(data: {
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
  }) {
    const [product] = await db
      .insert(products)
      .values(data)
      .returning();
    return product;
  },

  /**
   * Update a product.
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      basePrice: string;
      costPrice: string;
      categoryId: string;
      supplierId: string;
      collection: string;
      isFeatured: boolean;
      isNewSeason: boolean;
      status: "active" | "archived" | "draft";
    }>
  ) {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  },

  /**
   * Soft-delete: archive a product.
   */
  async archive(id: string) {
    const [product] = await db
      .update(products)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  },

  // --- Variants ---

  async createVariant(data: {
    productId: string;
    sku: string;
    size?: string;
    color?: string;
    stock?: number;
    minStock?: number;
    maxStock?: number;
    priceOverride?: string;
  }) {
    const [variant] = await db
      .insert(productVariants)
      .values(data)
      .returning();
    return variant;
  },

  async updateVariant(
    variantId: string,
    data: Partial<{
      sku: string;
      size: string;
      color: string;
      stock: number;
      minStock: number;
      maxStock: number;
      priceOverride: string;
    }>
  ) {
    const [variant] = await db
      .update(productVariants)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productVariants.id, variantId))
      .returning();
    return variant;
  },

  async deleteVariant(variantId: string) {
    await db
      .delete(productVariants)
      .where(eq(productVariants.id, variantId));
  },

  // --- Images ---

  async addImage(data: {
    productId: string;
    url: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }) {
    const [image] = await db
      .insert(productImages)
      .values(data)
      .returning();
    return image;
  },
};
