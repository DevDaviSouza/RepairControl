import z from "zod"


export const validPagination = (page: any, limit: any) => {
  if(page && isNaN(Number(page))) {
    throw new Error("O parâmetro page deve ser um número")
  }
  if(limit && isNaN(Number(limit))) {
    throw new Error("O parâmetro limit deve ser um número")
  }
  if(page && Number(page) < 0) {
    throw new Error("O parâmetro page deve ser maior ou igual a 0")
  }
  if(limit && (Number(limit) < 1 || Number(limit) > 100)) {
    throw new Error("O parâmetro limit deve ser maior ou igual a 1 e menor ou igual a 100")
  }
}

export const paginationSchema = z.object({
  page: z.string().min(0),
  limit: z.string().min(0).max(100)
})