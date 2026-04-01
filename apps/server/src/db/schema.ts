import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "archived",
  "draft",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "credit_card",
  "debit_card",
  "qris",
  "transfer",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "completed",
  "pending",
  "returned",
  "cancelled",
]);

export const inventoryLogTypeEnum = pgEnum("inventory_log_type", [
  "sale",
  "restock",
  "adjustment",
  "return",
  "initial",
]);

export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", [
  "draft",
  "ordered",
  "in_transit",
  "delivered",
  "cancelled",
]);

// ============================================================
// AUTH TABLES (Better Auth managed)
// ============================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: varchar("role", { length: 20 }).notNull().default("cashier"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// BUSINESS TABLES
// ============================================================

// --- Categories ---
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Suppliers ---
export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Products ---
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  basePrice: numeric("base_price", { precision: 15, scale: 2 }).notNull(),
  costPrice: numeric("cost_price", { precision: 15, scale: 2 }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  supplierId: uuid("supplier_id").references(() => suppliers.id, {
    onDelete: "set null",
  }),
  collection: varchar("collection", { length: 100 }),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNewSeason: boolean("is_new_season").notNull().default(false),
  status: productStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Product Variants (SKU level) ---
export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  size: varchar("size", { length: 20 }),
  color: varchar("color", { length: 50 }),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(10),
  maxStock: integer("max_stock").notNull().default(100),
  priceOverride: numeric("price_override", { precision: 15, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Product Images ---
export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  isPrimary: boolean("is_primary").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// --- Transactions ---
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).default("Anonim"),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 })
    .notNull()
    .default("0"),
  discount: numeric("discount", { precision: 15, scale: 2 })
    .notNull()
    .default("0"),
  tax: numeric("tax", { precision: 15, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 15, scale: 2 }).notNull().default("0"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentDetail: varchar("payment_detail", { length: 100 }),
  status: transactionStatusEnum("status").notNull().default("completed"),
  notes: text("notes"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Transaction Items ---
export const transactionItems = pgTable("transaction_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .notNull()
    .references(() => transactions.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull(),
});

// --- Inventory Logs ---
export const inventoryLogs = pgTable("inventory_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  type: inventoryLogTypeEnum("type").notNull(),
  quantityChange: integer("quantity_change").notNull(),
  stockAfter: integer("stock_after").notNull(),
  referenceId: uuid("reference_id"),
  notes: text("notes"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Purchase Orders ---
export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => suppliers.id),
  status: purchaseOrderStatusEnum("status").notNull().default("draft"),
  expectedDate: date("expected_date"),
  totalCost: numeric("total_cost", { precision: 15, scale: 2 })
    .notNull()
    .default("0"),
  notes: text("notes"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Purchase Order Items ---
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  unitCost: numeric("unit_cost", { precision: 15, scale: 2 }).notNull(),
});

// ============================================================
// RELATIONS
// ============================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  transactions: many(transactions),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
  purchaseOrders: many(purchaseOrders),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    inventoryLogs: many(inventoryLogs),
    transactionItems: many(transactionItems),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    createdByUser: one(user, {
      fields: [transactions.createdBy],
      references: [user.id],
    }),
    items: many(transactionItems),
  })
);

export const transactionItemsRelations = relations(
  transactionItems,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionItems.transactionId],
      references: [transactions.id],
    }),
    variant: one(productVariants, {
      fields: [transactionItems.variantId],
      references: [productVariants.id],
    }),
  })
);

export const inventoryLogsRelations = relations(inventoryLogs, ({ one }) => ({
  variant: one(productVariants, {
    fields: [inventoryLogs.variantId],
    references: [productVariants.id],
  }),
  createdByUser: one(user, {
    fields: [inventoryLogs.createdBy],
    references: [user.id],
  }),
}));

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
    createdByUser: one(user, {
      fields: [purchaseOrders.createdBy],
      references: [user.id],
    }),
    items: many(purchaseOrderItems),
  })
);

export const purchaseOrderItemsRelations = relations(
  purchaseOrderItems,
  ({ one }) => ({
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderItems.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    variant: one(productVariants, {
      fields: [purchaseOrderItems.variantId],
      references: [productVariants.id],
    }),
  })
);
