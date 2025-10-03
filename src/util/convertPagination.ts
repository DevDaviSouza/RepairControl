import { paginationSchema } from "../validation/validPagination"

export const convertPagination = (page: any, limit: any) => {
  if(!page) page = 0
  if(!limit) limit = 15
  
  const paginationParse = {
    page: page,
    limit: limit
  }
  const newPaginationParse = paginationSchema.parse(paginationParse)
  
  const p = newPaginationParse.page ? page * limit : Number(0)
  const l = limit ? Number(limit) : Number(15)
  
  return {page: p, limit: l}
}