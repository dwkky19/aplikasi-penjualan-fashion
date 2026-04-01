import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

// Extend Express Request to carry user/session data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        image?: string | null;
      };
      session?: {
        id: string;
        token: string;
        expiresAt: Date;
      };
    }
  }
}

/**
 * Middleware: require a valid authenticated session.
 * Attaches req.user and req.session.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized – sesi tidak valid." });
      return;
    }

    req.user = session.user as Express.Request["user"];
    req.session = session.session as Express.Request["session"];
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized – gagal memverifikasi sesi." });
  }
};

/**
 * Middleware factory: restrict access to specific roles.
 * Must be used AFTER requireAuth.
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ error: "Forbidden – akses tidak diizinkan untuk peran ini." });
      return;
    }
    next();
  };
};
