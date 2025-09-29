import { PrismaClient } from "@prisma/client"
import { validData } from "../validation/customers/validData"
import { validPagination } from "../validation/customers/validPagination"
import { convertPagination } from "../util/convertPagination"

const prisma = new PrismaClient()

const findAllCustomers = async (page: any, limit: any) => {
  const pagination = convertPagination(page, limit)
  
  validPagination(Number(page), Number(limit))
  
  const items = await prisma.customers.findMany(
    {
      skip: pagination.page,
      take: pagination.limit,
      orderBy: {
        nm_customer: 'asc'
      }
    }
  )

  const totalItems = await prisma.customers.count()

  return {
    items,
    totalItems
  }

}

const findCustomerForId = async (id: number) => {
   return await prisma.customers.findUnique({where: {
    customers_id: id
  }})
}

const createCustomer = async (customer: any) => {

  validData(customer)

  const existsCustomerVerify = await prisma.customers.findFirst({
    where: {
       nm_cpf: customer.cpf
    }
  })

  if(existsCustomerVerify) throw new Error("Cliente já cadastrado")

   const clienteCadastrado = await prisma.customers.create({
    data: {
      nm_customer: customer.name,
      ds_phone: customer.phone,
      ds_mail: customer.email,
      nm_cpf: customer.cpf
    }
  })
  return {
    message: "Cliente cadastrado com sucesso",
    id: clienteCadastrado.customers_id
  }
}

const updateCustomer = async (id: number, customer: any) => {

    validData(customer)

    const existsCustomerVerify = await prisma.customers.findFirst({
      where: {
        nm_cpf: customer.cpf
      }
    })

    if(existsCustomerVerify) throw new Error("Cliente já cadastrado")
    
    await prisma.customers.update({
      where: {
        customers_id: id
      },
      data: {
        nm_customer: customer.name,
        ds_phone: customer.phone,
        ds_mail: customer.email,
        nm_cpf: customer.cpf
      }
    })

    return {message: "Cliente atualizado com sucesso"}
}


const deleteCustomer = async (id: number) => {
  
  const existsOrder = await prisma.orders.findFirst({
    where: {
      customer_id: id
    }
  })

  if(existsOrder) throw new Error("Cliente vinculado a um pedido, não pode ser excluído")
  
  await prisma.customers.delete({
    where: {
      customers_id: id
    }
  })

  return {message: "Cliente excluído com sucesso"}
}


export {
  findAllCustomers,
  findCustomerForId,
  createCustomer,
  updateCustomer,
  deleteCustomer
}