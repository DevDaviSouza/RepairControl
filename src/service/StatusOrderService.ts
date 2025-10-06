import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findAllStatusOrders = async () => {
  return await prisma.statusOrder.findMany();
}

const createStatusOrder = async (status: any) => {
  const statusCreated = await prisma.statusOrder.create({
    data: { 
      ds_status: status,
    }
  });
  return {
    message: "Status cadastrado com sucesso",
    id: statusCreated.status_id
  };
}

export {
  findAllStatusOrders,
  createStatusOrder
}