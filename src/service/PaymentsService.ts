import { PrismaClient } from "@prisma/client";
import { isValidValuePayment } from "../validation/payments/validValuePayment";
import z from "zod";
import { log } from "console";

const prisma = new PrismaClient()

const findTotalPayments = async () => {
  const totalPayments = await prisma.payments.aggregate({
    _sum: {
      vl_payment: true,
    },
    _count: {
      payment_id: true,
    }
  });
  
  if (!totalPayments) {
    throw new Error("No payments found");
  }
  
  return totalPayments;
}

const findPayments = async () => {
  const payments = await prisma.payments.findMany();
  return payments;
}

const findPaymentFromOrder = async (id: number) => {
  const find = await prisma.payments.findFirst({
    where: {
      order_id: id,
    }
  })

  return find;
}

const findOrderValue = async (id: number) => {
  const find = await prisma.orders.findUnique({
    where: {
      order_id: id,
    },
    select: {
      vl_total: true,
    }
  })
  return find?.vl_total;
}

const findPaymentById = async (id: number) => {
  const find = await prisma.payments.findUnique({
    where: {
      payment_id: id,
    },
    select: {
      vl_total: true,
      vl_payment: true,
      vl_reamining: true,
    }
  });
  return find;
}

const editPayment = async (id: number, payment: any) => {
  const captureRemaining = await findPaymentById(id);
  console.log("vl_payment", captureRemaining?.vl_payment);
  
  const currentPayment = Number(captureRemaining?.vl_payment ?? 0);
  const currentRemaining = Number(captureRemaining?.vl_reamining ?? 0);
  
  const validPayment: number = payment + currentPayment;
  console.log("validPayment: " + validPayment);

  const paymentData = await prisma.payments.update({
    where: {
      payment_id: id,
    },
    data: {
      vl_payment: validPayment,
      vl_reamining: currentRemaining - payment
    }
  })

  return {
    message: "Pagamento alterado com sucesso",
    payment: paymentData
  }
}

const createPayment = async (id: number, payment: number) => {
  const paymentExists = await findPaymentFromOrder(id);
  const totalOrderValue = await findOrderValue(id);
  
  if (paymentExists) {
    const validPayment = z.float64().min(0.01, "Valor do pagamento deve ser maior que zero").max(Number(paymentExists.vl_reamining), "valor digitado acima do permitido para esse pagamento").parse(payment);
    console.log(paymentExists.vl_reamining);
    console.log(validPayment);
    
    const alterPayment = await editPayment(paymentExists.payment_id, validPayment)

    return { alterPayment }
  }
  
  const validPayment = z.float64().min(0.01, "Valor do pagamento deve ser maior que zero").max(Number(totalOrderValue)).parse(payment);
  const calcVlRemaining = Number(totalOrderValue) - Number(validPayment);

  const r = await prisma.payments.create({
    data: {
      order_id: id,
      vl_total: Number(totalOrderValue),
      vl_payment: payment,
      vl_reamining: calcVlRemaining
    }
  })

  return { message: "Pagamento criado com sucesso", payment: r}
}

const deletePayment = async (id: number) => {
  const r = await prisma.payments.delete({
    where: {
      payment_id: id
    }
  })
}

export { findTotalPayments, createPayment, editPayment, deletePayment, findPayments };