import { PrismaClient } from "@prisma/client"
import { convertPagination } from "../util/convertPagination"
import { validPagination } from "../validation/customers/validPagination"

const prisma = new PrismaClient()

const findAllOrders = async (page: any, limit: any) => {
  const pagination = convertPagination(page, limit)
  
  validPagination(pagination.page, pagination.limit)

  const items = await prisma.orders.findMany(
    {
      skip: pagination.page,
      take: pagination.limit,
      orderBy: {
        dt_order: 'desc'
      }
    }
  )
  
  const totalItems = await prisma.orders.count()

  return {
    items,
    totalItems
  }
}

const findOrderForId = async (id: number) => {
  const searchOrder = await prisma.orders.findUnique({where: {
    order_id: id
  }})

  if(!searchOrder) return({message: "Ordem de serviço não encontrada"})

  return searchOrder
}

// const findDelayedOrders = async () => {
//   const today = new Date()
  
//   const orders = await prisma.orders.findMany({
//     where: {
//       dt_completion: {
//         lt: today
//       },
//       : {
//         not: 'COMPLETED'
//       }
//     }
//   })
//   return orders
// }

export {
  findAllOrders,
  findOrderForId
}