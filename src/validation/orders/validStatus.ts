import z from "zod";

export const validStatus = z.object({
  status: z.number().min(1).max(7)
})