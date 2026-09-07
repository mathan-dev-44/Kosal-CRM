import { z } from "zod";

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .min(7, "Invalid phone number")
    .max(20, "Invalid phone number"),

  email: z.string().trim().email("Invalid email address").optional(),

  source: z
    .enum(["WEBSITE", "PHONE", "WALK_IN", "REFERRAL", "SOCIAL_MEDIA", "OTHER"])
    .default("OTHER"),

  stage: z
    .enum([
      "NEW",
      "CONTACTED",
      "SITE_VISIT",
      "INTERESTED",
      "NEGOTIATION",
      "BOOKED",
      "LOST",
    ])
    .default("NEW"),

  assignedTo: z.uuid("Invalid assigned user ID").optional(),
});

export const updateLeadSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  phone: z.string().trim().min(7).max(20).optional(),

  email: z.string().trim().email("Invalid email address").optional(),

  source: z
    .enum(["WEBSITE", "PHONE", "WALK_IN", "REFERRAL", "SOCIAL_MEDIA", "OTHER"])
    .optional(),

  stage: z
    .enum([
      "NEW",
      "CONTACTED",
      "SITE_VISIT",
      "INTERESTED",
      "NEGOTIATION",
      "BOOKED",
      "LOST",
    ])
    .optional(),
});

export const assignLeadSchema = z.object({
  assignedTo: z.uuid("Invalid user ID"),
});
