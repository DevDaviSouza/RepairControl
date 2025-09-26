import { Request, Response, Router } from "express";
import { findAll, findOne } from "../service/CustomersService";

const endpoints = Router();

endpoints.get("/customers", async (req: Request, resp: Response) => {
  
  const r = await findAll()
  
  resp.send(r)
})

endpoints.get("/customers/:id", async (req: Request, resp: Response) => {
  const id = req.params.id

  const r = await findOne(Number(id))

  resp.send(r)
})

export default endpoints;