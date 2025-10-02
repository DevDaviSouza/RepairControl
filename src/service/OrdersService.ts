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

const findDelayedOrders = async (page: any, limit: any) => {
  const today = new Date()

  const pagination = convertPagination(page, limit)
  validPagination(pagination.page, pagination.limit)
  
  const orders = await prisma.orders.findMany({
    where: {
      AND: [
        {
          dt_completion: { lt: today },
        },
        { OR: [
          {status_id: {not : 7 }},
          {status_id: {not : 6 }}
          ]
       }
      ] 
    },
    skip: pagination.page,
    take: pagination.limit,
    orderBy: {
      dt_order: 'desc'
    },
})

  const totalItems = await prisma.orders.count({
    where: {
      AND: [
        {
          dt_completion: { lt: today },
        },
        { OR: [
          {status_id: {not : 7 }},
          {status_id: {not : 6 }}
          ]
       }
      ] 
    },
    skip: pagination.page,
    take: pagination.limit,
    orderBy: {
      dt_order: 'desc'
    }
  })

  return {
    items: orders,
    totalItems
  }
}

export {
  findAllOrders,
  findOrderForId,
  findDelayedOrders
}