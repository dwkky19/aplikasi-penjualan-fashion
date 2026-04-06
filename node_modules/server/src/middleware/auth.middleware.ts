import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { simpleSessions } from "../index.js";

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
 * Parse cookies from request headers
 */
function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.cookie || "";
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...val] = c.trim().split("=");
      return [key, val.join("=")];
    })
  );
}

/**
 * Try to authenticate via simple session cookie.
 * Returns true if authenticated, false otherwise.
 */
function trySimpleSession(req: Request): boolean {
  const cookies = parseCookies(req);
  const token = cookies["simple_session"];
  if (!token) return false;

  const session = simpleSessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    simpleSessions.delete(token);
    return false;
  }

  req.user = {
    id: session.id,
    name: session.name,
    email: `${session.username}@local`,
    role: session.role,
  };
  req.session = {
    id: token,
    token: token,
    expiresAt: session.expiresAt,
  };
  return true;
}

/**
 * Middleware: require a valid authenticated session.
 * First tries Better Auth, then falls back to simple session.
 * Attaches req.user and req.session.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Try simple session first (faster)
  if (trySimpleSession(req)) {
    next();
    return;
  }

  // 2. Try Better Auth session
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
