import { Request, Response, Router } from "express";
import { findAll } from "../service/UsersService";

const endpoints = Router();

endpoints.get("/users", async (req: Request, resp: Response) => {
  const r = await findAll()

  resp.send(r)
})

export default endpoints;