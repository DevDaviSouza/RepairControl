import { PrismaClient } from "@prisma/client"
import { convertPagination } from "../util/convertPagination"
import { orderSchema } from "../validation/orders/validData"
import { convertBodyOrder } from "../util/converBodyOrder"
import { validStatus } from "../validation/orders/validStatus"
import { validCompletionDate } from "../validation/orders/validCompletionDate"

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

//criar uma ordem
const createOrder = async (order: any) => {
  const convertOrder = convertBodyOrder(order)
  
  const dataParsed = orderSchema.parse(convertOrder)

  await prisma.orders.create({
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
}

//alterar status de uma ordem
  const changeStatus = async (status: number, id: number) => {
    const existsOrder = await findOrderForId(id)

    if(!existsOrder || !('order_id' in existsOrder)) return({message: "Ordem de serviço não encontrada"})

    const validatedStatus = validStatus.parse({status})

    await prisma.orders.update({
      where: {
        order_id: id
      },
      data: {
        status_id: validatedStatus.status
      }
    })

    if(validatedStatus.status === 7) {
      await finalizeOrder(id)
    }

    const existsOrderAltered = await findOrderForId(id)

    return {
      message: "Status atualizado com sucesso",
      order: existsOrderAltered
    }
}

//finalizar uma ordem
const finalizeOrder = async (id: number) => {
  const today = new Date()

  const dateNow = new Date(today)
  dateNow.setHours(dateNow.getHours() - 3)

  const existsOrder = await findOrderForId(id)
  if(!existsOrder || !('order_id' in existsOrder)) return({message: "Ordem de serviço não encontrada"})

  const updatedOrder = await prisma.orders.update({
    where: {
      order_id: id
    },
    data: {
      status_id: 7,
      bt_delivered: true,
      dt_delivered: dateNow
    }
  })
  return {
    message: "Ordem de serviço finalizada com sucesso",
    order: updatedOrder
  }
}

//alterar data de conclusão
const newCompletionDate = async (id: number, dtCompletion: Date) => {
  
  const existsOrder = await findOrderForId(id)
  if(!existsOrder || !('order_id' in existsOrder)) return({message: "Ordem de serviço não encontrada"})
  
  const newDtCompletion = validCompletionDate.parse(dtCompletion)
  
  const updatedOrder = await prisma.orders.update({
    where: {
      order_id: id
    },
    data: {
      dt_completion: newDtCompletion.dtCompletion
    }
  })

  return {
    message: "Data de conclusão alterada com sucesso",
    order: updatedOrder
  }
}

//alterar uma ordem
const alterOrder = async (order: any, id: number) => {
  const convertOrder = convertBodyOrder(order)
  const dataParsed = orderSchema.parse(convertOrder)
  
  const existsOrder = await findOrderForId(id)
  if(!existsOrder || !('order_id' in existsOrder)) return({message: "Ordem de serviço não encontrada"})

  const updatedOrder = await prisma.orders.update({
    where: {
      order_id: id
    },
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
    message: "Ordem de serviço alterada com sucesso",
    order: updatedOrder
  }
}

//deletar uma ordem
const deleteOrder = async (id: number) => {
  const existsOrder = await findOrderForId(id)
  if(!existsOrder || !('order_id' in existsOrder)) return({message: "Ordem de serviço não encontrada"})

  await prisma.orders.delete({
    where: {
      order_id: id
    }
  })
  return {message: "Ordem de serviço deletada com sucesso"}
}

export {
  findAllOrders,
  findOrderForId,
  findDelayedOrders,
  findDelayedOrdersCount,
  findPendingPainting,
  findProxLate,
  findDeliveryItems,
  createOrder,
  changeStatus,
  finalizeOrder,
  newCompletionDate,
  alterOrder,
  deleteOrder
}