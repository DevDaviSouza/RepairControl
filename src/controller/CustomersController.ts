import { Request, Response, Router } from "express";
import { createCustomer, deleteCustomer, findAllCustomers, findCustomerForId, updateCustomer } from "../service/CustomersService";

const endpoints = Router();


endpoints.get("/customers", async (req: Request, resp: Response) => {
  
  const {page, limit} = req.query

  const r = await findAllCustomers(page, limit)
  
  resp.send(r)
})

endpoints.get("/customers/:id", async (req: Request, resp: Response) => {
  const id = req.params.id

  const r = await findCustomerForId(Number(id))

  resp.send(r)
})

endpoints.post("/customers", async (req: Request, resp: Response) => {
  const customer = req.body

  const newUser = {
    name: customer.name,
    phone : customer.phone,
    email: customer.email,
    cpf: customer.cpf
  }

  const r = await createCustomer(newUser)

  resp.send(r)
})

endpoints.put("/customers/:id", async (req: Request, resp: Response) => {
  const id = req.params.id
  const customer = req.body

  const dataCustomer = {
    name: customer.name,
    phone : customer.phone,
    email: customer.email,
    cpf: customer.cpf
  }
  const r = await updateCustomer(Number(id), dataCustomer)
  resp.send(r)
})

endpoints.delete("/customers/:id", async (req: Request, resp: Response) => {
  const id = req.params.id

  const r = await deleteCustomer(Number(id))
  resp.send(r)
})

export default endpoints;