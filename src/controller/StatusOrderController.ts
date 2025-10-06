import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { createStatusOrder, findAllStatusOrders } from "../service/StatusOrderService";

const prisma = new PrismaClient()

const endpoints = Router();

endpoints.get("/statusOrder", async (req: Request, resp: Response) => {
  const r = await findAllStatusOrders()

  resp.send(r)
})

endpoints.post("/statusOrder", async (req: Request, resp: Response) => {
  const {status} = req.body
  
  const r = await createStatusOrder(status)

  resp.send(r)
  
})

export default endpoints;