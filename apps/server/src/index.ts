import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import "dotenv/config";

import { auth } from "./auth.js";

// Routers
import authRouter from "./routers/auth.router.js";
import dashboardRouter from "./routers/dashboard.router.js";
import productRouter from "./routers/product.router.js";
import categoryRouter from "./routers/category.router.js";
import inventoryRouter from "./routers/inventory.router.js";
import transactionRouter from "./routers/transaction.router.js";
import analyticsRouter from "./routers/analytics.router.js";
import supplierRouter from "./routers/supplier.router.js";

// Middleware
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// ─── CORS ────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Better Auth handler (MUST come BEFORE express.json!) ─
// Mount directly on app, NOT inside a sub-Router, to avoid path stripping.
app.all("/api/auth/*splat", toNodeHandler(auth));

// ─── Body parsing (AFTER auth handler) ────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Custom auth routes (me endpoint) ─────────────────────
app.use(authRouter);

// ─── API Routes ──────────────────────────────────────────
app.use("/api/dashboard", dashboardRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/suppliers", supplierRouter);

// ─── Health Check ────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   🏪 Fashion Store API Server               ║
  ║   Running on http://localhost:${PORT}          ║
  ║   Environment: ${process.env.NODE_ENV || "development"}              ║
  ╚══════════════════════════════════════════════╝
  `);
});

export default app;
