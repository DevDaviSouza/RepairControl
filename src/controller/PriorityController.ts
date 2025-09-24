import { Request, Response, Router } from "express";
import db from "../models/db";

const endpoints = Router();

endpoints.get("/priority", async (req: Request, resp: Response) => {
  
  let r = await db.priority.findAll();
  
  resp.send(r)
})

export default endpoints;