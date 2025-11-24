import z from "zod";

export function isValidValueNewPayment(payment: number, totalValue: number) {
  const validValuePayment = z.object({
    payment: z.float64().min(0.01, "Valor do pagamento deve ser maior que zero").max(totalValue, "valor digitado acima do permitido para esse pagamento")
  });

  const validPayment = validValuePayment.parse( {payment} );

  return validPayment.payment
};

export function isValidValueEditPayment(payment: number, remainingValue: number) {
 const validValuePayment = z.object({
    payment: z.float64().min(0.01, "Valor do pagamento deve ser maior que zero").max(remainingValue, "valor digitado acima do permitido para esse pagamento")
 }) 

 const validPayment = validValuePayment.parse( {payment} );

 return validPayment.payment
}