import z from "zod"

const today = new Date()

export const validCompletionDate = z.object({
  dtCompletion: z.date().min(today)
})