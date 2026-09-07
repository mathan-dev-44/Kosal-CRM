import { z } from "zod";

export const createFollowUpSchema = z.object({
  scheduledAt: z.string().datetime({
    message: "Invalid scheduled date and time",
  }),

  remarks: z
    .string()
    .trim()
    .max(1000, "Remarks cannot exceed 1000 characters")
    .optional(),
});

export const updateFollowUpSchema = z.object({
  scheduledAt: z
    .string()
    .datetime({
      message: "Invalid scheduled date and time",
    })
    .optional(),

  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),

  remarks: z
    .string()
    .trim()
    .max(1000, "Remarks cannot exceed 1000 characters")
    .optional(),
});
