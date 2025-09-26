import { Request, Response, Router } from "express";
import { findAll } from "../service/OrdersService";

const endpoints = Router();

endpoints.get("/orders", async (req: Request, resp: Response) => {
  const r = await findAll()

  resp.send(r)
})

export default endpoints;