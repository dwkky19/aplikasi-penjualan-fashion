import type { Request, Response, NextFunction } from "express";

/**
 * Global error handler middleware.
 * Catches all unhandled errors thrown from route handlers.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("❌ Unhandled error:", err.message);
  console.error(err.stack);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Terjadi kesalahan pada server."
        : err.message,
  });
};
