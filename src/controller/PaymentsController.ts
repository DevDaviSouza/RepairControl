import { Request, Response, Router } from "express";
import { createPayment, deletePayment, editPayment, findPayments, findTotalPayments } from "../service/PaymentsService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const endpoints = Router();

endpoints.get("/payments/total", async (req: Request, resp: Response) => {
  const r = await findTotalPayments()

  resp.send(r)
});

endpoints.get("/payments", async (req: Request, resp: Response) => {
  const r = await findPayments()

  resp.send(r)
})

endpoints.post("/payment/:orderId", async (req: Request, resp: Response) => {
  const { orderId } = req.params;
  const {payment} = req.body;

  const r = await createPayment(Number(orderId), Number(payment))

  resp.send(r)
})

endpoints.put("/payment/:id", async (req: Request, resp: Response) => {
  const { id } = req.params;
  const { payment } = req.body;

  const r = await editPayment(Number(id), Number(payment))

  resp.send(r)
});

endpoints.delete("/payment/:id", async (req: Request, resp: Response) => {
  const { id } = req.params;
  
  const r = await deletePayment(Number(id));

  resp.send({
    message: "Pagamento deletado com sucesso",
    payment: r
  })
});

export default endpoints;