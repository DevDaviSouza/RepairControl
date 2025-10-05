import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const endpoints = Router();

endpoints.get("/statusOrder", async (req: Request, resp: Response) => {
  const r = await  prisma.statusOrder.findMany()

  resp.send(r)
})

endpoints.post("/statusOrder", async (req: Request, resp: Response) => {
  const status = req.body
  const statusCreated = await prisma.statusOrder.create({
    data: {
      ds_status: status.ds_status,
    }
  })
  resp.send({
    message: "Status cadastrado com sucesso",
    id: statusCreated.status_id
  })
})

export default endpoints;