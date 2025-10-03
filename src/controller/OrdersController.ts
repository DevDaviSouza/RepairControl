import { Request, Response, Router } from "express";
import { findAllOrders, findDelayedOrders, findDelayedOrdersCount, findOrderForId, findPendingPainting, findProxLate } from "../service/OrdersService";

const endpoints = Router();

endpoints.get("/orders", async (req: Request, resp: Response) => {
  const {page, limit} = req.query
  
  const r = await findAllOrders(page, limit)

  resp.send(r)
})


endpoints.get("/orders/late", async (req: Request, resp: Response) => {
  const {page, limit} = req.query  
  
  const r = await findDelayedOrders(page, limit)

  resp.send(r)
})

endpoints.get("/orders/late/count", async (req: Request, resp: Response) => {
  const r = await findDelayedOrdersCount()

  resp.send({
    total: r
  })
})


endpoints.get("/orders/pendingPainting", async (req: Request, resp: Response) => {
  const r = await findPendingPainting()
  
  resp.send(r)
})

endpoints.get("/orders/proxLate", async (req: Request, resp: Response) => {
  const r = await findProxLate()
  
  resp.send(r)
})

endpoints.get("/orders/:id", async (req: Request, resp: Response) => {
  const id = req.params.id

   const r = await findOrderForId(Number(id))

  resp.send(r)
})

export default endpoints;