import { Request, Response, Router } from "express";
import db from "../models/db";

const endpoints = Router();

endpoints.get("/orders", async (req: Request, resp: Response) => {
  let r = await db.orders.findAll()
  resp.send(r)
})

export default endpoints;