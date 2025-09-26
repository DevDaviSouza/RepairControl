import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const findAll = async () => {
  return await prisma.users.findMany()
}

export {
  findAll
}