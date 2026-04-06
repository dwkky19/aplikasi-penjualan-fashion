import express from "express";
import cors from "cors";
import crypto from "crypto";
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

// ─── In-memory simple session store ──────────────────────
const simpleSessions = new Map<string, {
  id: string;
  username: string;
  role: string;
  name: string;
  expiresAt: Date;
}>();

// Export for use in auth middleware
export { simpleSessions };

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

// ─── Simple Login Endpoints ──────────────────────────────
/**
 * POST /api/simple-login — login with username/password (admin/admin)
 */
app.post("/api/simple-login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    simpleSessions.set(sessionToken, {
      id: "admin-user-id",
      username: "admin",
      role: "admin",
      name: "Administrator",
      expiresAt,
    });

    // Set session cookie
    res.cookie("simple_session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      user: {
        id: "admin-user-id",
        name: "Administrator",
        username: "admin",
        role: "admin",
      },
      message: "Login berhasil",
    });
  } else {
    res.status(401).json({ error: "Username atau password salah." });
  }
});

/**
 * GET /api/simple-session — check current simple session
 */
app.get("/api/simple-session", (req, res) => {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );

  const token = cookies["simple_session"];
  if (!token) {
    res.status(401).json({ error: "No session" });
    return;
  }

  const session = simpleSessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    simpleSessions.delete(token);
    res.status(401).json({ error: "Session expired" });
    return;
  }

  res.json({
    user: {
      id: session.id,
      name: session.name,
      username: session.username,
      role: session.role,
    },
  });
});

/**
 * POST /api/simple-logout — destroy simple session
 */
app.post("/api/simple-logout", (req, res) => {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );

  const token = cookies["simple_session"];
  if (token) {
    simpleSessions.delete(token);
  }

  res.cookie("simple_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.json({ message: "Logout berhasil" });
});

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
