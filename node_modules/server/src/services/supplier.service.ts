import { db } from "../db/index.js";
import { suppliers } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const supplierService = {
  async list() {
    return db.query.suppliers.findMany({
      orderBy: [suppliers.name],
    });
  },

  async getById(id: string) {
    return db.query.suppliers.findFirst({
      where: eq(suppliers.id, id),
      with: { products: true, purchaseOrders: true },
    });
  },

  async create(data: {
    name: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }) {
    const [supplier] = await db
      .insert(suppliers)
      .values(data)
      .returning();
    return supplier;
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      contactEmail: string;
      contactPhone: string;
      address: string;
    }>
  ) {
    const [supplier] = await db
      .update(suppliers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return supplier;
  },

  async delete(id: string) {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  },
};
