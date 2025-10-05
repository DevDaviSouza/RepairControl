import { Request, Response, Router } from "express";
import { createEnterprise, findAll } from "../service/EnterprisesService";

const endpoints = Router();

endpoints.get("/enterprises", async (req: Request, resp: Response) => {
  const r = await findAll()

  resp.send(r)
})

endpoints.post("/enterprises", async (req: Request, resp: Response) => {
  const enterprise = req.body
  const r = await createEnterprise(enterprise)

  resp.send(r)
})

export default endpoints;