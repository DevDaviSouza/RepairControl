import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const findAll = async () => {
  return await prisma.enterprises.findMany()
}

const createEnterprise = async (enterprise: any) => {
  const clienteCadastrado = await prisma.enterprises.create({
    data: {
      nm_enterprise: enterprise.nm_enterprise,
      ep_fantasy: enterprise.ep_fantasy,
      ep_cnpj: enterprise.ep_cnpj,
    }
  })
  return {
    message: "Empresa cadastrada com sucesso",
    id: clienteCadastrado.enterprise_id
  }
}

export {
  findAll,
  createEnterprise
}