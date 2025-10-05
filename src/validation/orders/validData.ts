import z from "zod";

export const orderSchema = z.object({
  customerId: z.number().min(1),
  dsModel: z.string().min(1),
  dsColor: z.string().min(1),
  dtYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  dsPlate: z.string().min(1),
  qtdRepair: z.number().min(0),
  qtdPainting: z.number().min(0),
  dtOrder: z.date(),
  dtCompletion: z.date(),
  dsServices: z.string().min(1),
  priorityId: z.number().min(1),
  vlTotal: z.number().min(0),
  enterpriseId: z.number().min(1)
})