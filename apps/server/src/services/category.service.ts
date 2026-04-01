import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const categoryService = {
  async list() {
    return db.query.categories.findMany({
      orderBy: [categories.name],
    });
  },

  async getById(id: string) {
    return db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: { products: true },
    });
  },

  async create(data: { name: string; slug: string; description?: string }) {
    const [category] = await db
      .insert(categories)
      .values(data)
      .returning();
    return category;
  },

  async update(
    id: string,
    data: Partial<{ name: string; slug: string; description: string }>
  ) {
    const [category] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  },

  async delete(id: string) {
    await db.delete(categories).where(eq(categories.id, id));
  },
};
