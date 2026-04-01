import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

/**
 * Middleware factory: validate request body against a Zod schema.
 * On success, replaces req.body with the parsed (cleaned) object.
 * On failure, returns 400 with structured validation errors.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: "Validation Error",
          details: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
};
