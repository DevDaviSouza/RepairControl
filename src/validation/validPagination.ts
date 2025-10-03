import z from "zod"

export const paginationSchema = z.object({
  page: z.int().min(0),
  limit: z.int().min(0).max(100)
})