import { Request, Response, Router } from "express";
import { alterOrder, changeStatus, createOrder, deleteOrder, finalizeOrder, findAllOrders, findDelayedOrders, findDelayedOrdersCount, findDeliveryItems, findOrderForId, findPendingPainting, findProxLate, newCompletionDate } from "../service/OrdersService";
import { Prisma } from "@prisma/client";

const endpoints = Router();

endpoints.get("/orders", async (req: Request, resp: Response) => {
  const {page, limit} = req.query
  
  const r = await findAllOrders(Number(page), Number(limit))

  resp.send(r)
})

endpoints.get("/orders/late", async (req: Request, resp: Response) => {
  const {page, limit} = req.query  
  
  const r = await findDelayedOrders(Number(page), Number(limit))

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

endpoints.get("/orders/deliveryItems", async (req: Request, resp: Response) => {
  const r = await findDeliveryItems()
  
  resp.send(r)
})

endpoints.get("/orders/:id", async (req: Request, resp: Response) => {
  const id = req.params.id

   const r = await findOrderForId(Number(id))

  resp.send(r)
})

endpoints.post("/orders", async (req: Request, resp: Response) => {
  const order = req.body

  const r = await createOrder(order)

  resp.send(r)
})

endpoints.put("/orders/alterStatus/:id", async (req: Request, resp: Response) => {
  const id: string = req.params.id
  const {status} = req.body

  const r = await changeStatus(Number(status), Number(id))
  resp.send(r)
})

endpoints.put("/orders/finalize/:id", async (req: Request, resp: Response) => {
  const id: string = req.params.id

  const r = await finalizeOrder(Number(id))
  resp.send(r)
})

endpoints.put("/orders/alterCompletion/:id", async (req: Request, resp: Response) => {
  const id: string = req.params.id
  const {dtCompletion} = req.body

  const r = await newCompletionDate(Number(id), new Date(dtCompletion))

  resp.send(r)
})

endpoints.put("/orders/:id", async (req: Request, resp: Response) => {
  const id: string = req.params.id
  const order = req.body

  const r = await alterOrder(order, Number(id))

  resp.send(r)
})

endpoints.delete("/orders/:id", async (req: Request, resp: Response) => {
  const id: string = req.params.id

  const r = await deleteOrder(Number(id))

  resp.send(r)
})

export default endpoints;