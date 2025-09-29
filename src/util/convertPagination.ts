export const convertPagination = (page: any, limit: any) => {
  const p = page ? (Number(page)) * Number(limit) : 0
  const l = limit ? Number(limit) : 15
  
  return {page: p, limit: l}
}