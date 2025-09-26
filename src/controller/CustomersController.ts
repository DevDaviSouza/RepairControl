import { Request, Response, Router } from "express";
import { findAll, findOne } from "../service/CustomersService";

const endpoints = Router();

endpoints.get("/customers", async (req: Request, resp: Response) => {
  
  const r = await findAll()
  
  resp.send(r)
})

export default endpoints;