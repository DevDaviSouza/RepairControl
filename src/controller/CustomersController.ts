import { Request, Response, Router } from "express";
import db from "../models/db";

const endpoints = Router();

endpoints.get("/customers", async (req: Request, resp: Response) => {
  
  let r = await db.customers.findAll();
  
  resp.send(r)
})

export default endpoints;