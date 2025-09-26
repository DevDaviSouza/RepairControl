import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const findAll = async () => {
  return await prisma.customers.findMany()
}

const findOne = async (id: number) => {
   return await prisma.customers.findUnique({where: {
    customers_id: id
  }})
}


export {
  findAll,
  findOne
}