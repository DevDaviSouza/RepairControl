import z from "zod";

export const customerSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(8).max(19),
  email: z.email(),
  cpf: z.string().min(11).max(14)
})