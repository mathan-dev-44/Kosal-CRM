import { z } from "zod";

export const createBookingSchema = z.object({
  leadId: z.string().uuid("Invalid lead ID"),

  unitId: z.string().uuid("Invalid unit ID"),

  amount: z.coerce.number().min(0, "Booking amount cannot be negative"),
});
