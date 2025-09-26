import { Request, Response, Router } from "express";
import { findAll } from "../service/EnterprisesService";

const endpoints = Router();

endpoints.get("/enterprises", async (req: Request, resp: Response) => {
  const r = await findAll()

  resp.send(r)
})

export default endpoints;