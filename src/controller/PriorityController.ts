import { Request, Response, Router } from "express";
import { createPriority, findAll } from "../service/PriorityService";

const endpoints = Router();

endpoints.get("/priority", async (req: Request, resp: Response) => {
  const r = await findAll()

  resp.send(r)
})

endpoints.post("/priority", async (req: Request, resp: Response) => {
  const enterprise = req.body
  const r = await createPriority(enterprise)
  resp.send(r)
})

export default endpoints;