import { paginationSchema } from "../validation/customers/validPagination"

export const convertPagination = (page: any, limit: any) => {
  const paginationParse = {
    page: page,
    limit: limit
  }
  const newPaginationParse = paginationSchema.parse(paginationParse)
  
  const p = newPaginationParse.page ? page * limit : 0
  const l = limit ? Number(limit) : 15
  
  return {page: p, limit: l}
}