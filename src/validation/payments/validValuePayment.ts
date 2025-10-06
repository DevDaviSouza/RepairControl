import z from "zod";

export function isValidValuePayment(payment: number, totalValue: number) {
  if(payment > totalValue) return { valid: false, message: "Valor do pagamento maior que o valor total da ordem" }; 

  const validPayment = validValuePayment.parse( payment );

  return validPayment.payment
};

const validValuePayment = z.object({
  payment: z.number().min(0.01, "Valor do pagamento deve ser maior que zero")
});