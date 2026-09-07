import { z } from "zod";

export const createNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Note content is required")
    .max(2000, "Note cannot exceed 2000 characters"),
});
