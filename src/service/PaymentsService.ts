import { PrismaClient } from "@prisma/client";
import { isValidValueEditPayment, isValidValueNewPayment } from "../validation/payments/validValuePayment";
import z from "zod";

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
  
  const currentPayment = Number(captureRemaining?.vl_payment ?? 0);
  const currentRemaining = Number(captureRemaining?.vl_reamining ?? 0);
  
  const validPayment: number = payment + currentPayment;

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
    const validPayment = isValidValueEditPayment(payment, Number(paymentExists.vl_reamining));
    const alterPayment = await editPayment(paymentExists.payment_id, validPayment)

    return { alterPayment }
  }
  
  const validPayment = isValidValueNewPayment(payment, Number(totalOrderValue));
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

  return {
    message: "Pagamento deletado com sucesso",
    payment: r
  }
}

export { findTotalPayments, createPayment, editPayment, deletePayment, findPayments };