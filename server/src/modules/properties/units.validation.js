import { z } from "zod";

export const createUnitSchema = z.object({
  unitNumber: z
    .string()
    .trim()
    .min(1, "Unit number is required")
    .max(50, "Unit number cannot exceed 50 characters"),

  type: z.enum(["APARTMENT", "VILLA", "PLOT", "OFFICE", "SHOP"]),

  price: z.coerce.number().min(0, "Price cannot be negative"),

  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]).default("AVAILABLE"),
});

export const updateUnitSchema = z.object({
  unitNumber: z.string().trim().min(1).max(50).optional(),

  type: z.enum(["APARTMENT", "VILLA", "PLOT", "OFFICE", "SHOP"]).optional(),

  price: z.coerce.number().min(0).optional(),

  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]).optional(),
});
