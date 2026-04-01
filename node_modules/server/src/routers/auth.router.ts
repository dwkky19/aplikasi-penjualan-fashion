import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/me — Get current authenticated user profile.
 */
router.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
