import { Request, Response, Router } from "express";
import { findAll } from "../service/PriorityService";

const endpoints = Router();

endpoints.get("/priority", async (req: Request, resp: Response) => {
  const r = await findAll()

  resp.send(r)
})

export default endpoints;