import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const findAll = async () => {
  return await prisma.priority.findMany()
}

const createPriority = async (priority: any) => {
  const priorityCreated = await prisma.priority.create({
    data: {
      ds_priority: priority.ds_priority,
    }
  })
  return {
    message: "Prioridade cadastrada com sucesso",
    id: priorityCreated.priority_id
  }
}

export {
  findAll,
  createPriority
}