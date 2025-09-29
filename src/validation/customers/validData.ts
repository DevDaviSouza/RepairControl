type Customer = {
  name: string;
  phone: string;
  email: string;
  cpf: string;
}

export const validData = (customer: Customer) => {
  if(!customer.name || customer.name.length < 2) {
    throw new Error("Nome inválido")
  }
  if(!customer.phone || customer.phone.length < 8 || customer.phone.length > 19) {
    throw new Error("Telefone inválido")
  }
  if(!customer.email || customer.email.length < 5 || !customer.email.includes("@")) {
    throw new Error("Email inválido")
  }
  if(!customer.cpf || customer.cpf.length < 11 || customer.cpf.length > 14) {
    throw new Error("CPF inválido")
  }
}