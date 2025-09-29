import { Request, Response, Router } from "express";
import { findAllOrders, findOrderForId } from "../service/OrdersService";

const endpoints = Router();

endpoints.get("/orders", async (req: Request, resp: Response) => {
  const {page, limit} = req.query
  
  const r = await findAllOrders(page, limit)

  resp.send(r)
})

endpoints.get("/orders/:id", async (req: Request, resp: Response) => {
  const id = req.params.id

   const r = await findOrderForId(Number(id))

  resp.send(r)
})

export default endpoints;