import { PrismaClient } from "@prisma/client"
import { convertPagination } from "../util/convertPagination"
import { orderSchema } from "../validation/orders/validData"
import { convertBodyOrder } from "../util/converBodyOrder"

const prisma = new PrismaClient()

//listar todas as ordens
const findAllOrders = async (page: number, limit: number) => {
  
  const pagination = convertPagination(page, limit)
  
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

//listar uma ordem específica
const findOrderForId = async (id: number) => {
  const searchOrder = await prisma.orders.findUnique({where: {
    order_id: id
  }})

  if(!searchOrder) return({message: "Ordem de serviço não encontrada"})

  return searchOrder
}

//listar todas as ordens atrasadas
const findDelayedOrdersCount = async () => {
  const today = new Date()

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
    }
  })

  return totalItems
}

//listar todas as ordens atrasadas com paginação
const findDelayedOrders = async (page: number, limit: number) => {

  const pagination = convertPagination(page, limit)

  const today = new Date()
  
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

  const totalItems = await findDelayedOrdersCount()

  return {
    items: orders,
    totalItems
  }
}

//listar todas as ordens pendentes de pintura
const findPendingPainting = async () => {
  const totalItems = await prisma.orders.findMany({
    where: {
      status_id: { lt: 6 }
    },
    select: {
      qtd_painting: true,
      qtd_repair: true
    }
  })
  
  let qtdPainting = 0
  let qtdRepair = 0 

  for(const order of totalItems) {
     qtdPainting += order.qtd_painting ?? 0
     qtdRepair += order.qtd_repair ?? 0
  }

  return qtdPainting + qtdRepair
}

//listar todas ar ordens proximas de expirar
const findProxLate = async () => {
  const today = new Date()

    const lastDate = new Date(today)
    lastDate.setDate(lastDate.getDate() + 2)

  const orders = await prisma.orders.findMany({
    where: {
      AND: [
        {
          dt_completion: { lt: lastDate }
        },
        {
          dt_completion: { gt: today }
        }
      ]
    }
  })

  return orders
}

//listar quantidade de peças feitas no mês
const findDeliveryItems = async () => {
  const today = new Date()
  const lastDate = new Date(today)
  const qtdDays = (today.getDate() - 1)

  lastDate.setDate(today.getDate() - qtdDays)

  const orders = await prisma.orders.findMany({
    where: {
      AND: [
        {
        dt_delivered: { gt: lastDate }
        },
        {
          bt_delivered: { equals: true }
        }
      ]
    },
    select: {
      qtd_repair: true,
      qtd_painting: true
    }
  })

  let qtdRepair = 0
  let qtdPainting = 0
  
  for(const order of orders) {
    qtdRepair += order.qtd_repair ?? 0
    qtdPainting += order.qtd_painting ?? 0
  }

  return qtdPainting + qtdRepair
}

const createOrder = async (order: any) => {
  const convertOrder = convertBodyOrder(order)
  
  const dataParsed = orderSchema.parse(convertOrder)

  console.log(dataParsed);

  const newOrder = await prisma.orders.create({
    data: {
      customer_id: dataParsed.customerId,
      ds_model: dataParsed.dsModel,
      ds_color: dataParsed.dsColor,
      dt_year: dataParsed.dtYear,
      ds_plate: dataParsed.dsPlate,
      qtd_repair: dataParsed.qtdRepair,
      qtd_painting: dataParsed.qtdPainting,
      dt_order: dataParsed.dtOrder,
      dt_completion: dataParsed.dtCompletion,
      ds_services: dataParsed.dsServices,
      priority_id: dataParsed.priorityId,
      vl_total: dataParsed.vlTotal,
      enterprise_id: dataParsed.enterpriseId
    }
  })

  return {
    message: "Ordem de serviço criada com sucesso",
    id: newOrder.order_id
  }
}

export {
  findAllOrders,
  findOrderForId,
  findDelayedOrders,
  findDelayedOrdersCount,
  findPendingPainting,
  findProxLate,
  findDeliveryItems,
  createOrder
}