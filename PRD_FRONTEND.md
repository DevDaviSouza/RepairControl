# PRD - Documento de Requisitos do Produto
## Sistema de Gestão de Ordens de Serviço (dvCar)

### 1. Visão Geral do Sistema

O **dvCar** é um sistema de gestão de ordens de serviço para oficinas mecânicas e funilarias. O sistema permite gerenciar clientes, ordens de serviço, pagamentos, empresas e usuários, com funcionalidades de controle de status, prioridades e métricas de desempenho.

**Tecnologias do Backend:**
- Node.js com Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod para validação

**URL Base da API:** `http://localhost:3000` (ou conforme variável de ambiente `PORT_SERVER`)

---

### 2. Modelos de Dados

#### 2.1. Customers (Clientes)
```typescript
{
  customers_id: number;      // ID único (auto-incremento)
  nm_customer: string;       // Nome do cliente
  ds_phone: string;          // Telefone (máx 19 caracteres)
  ds_mail: string;           // Email
  nm_cpf: string;            // CPF (máx 14 caracteres)
  orders: Order[];           // Relação com ordens
}
```

#### 2.2. Orders (Ordens de Serviço)
```typescript
{
  order_id: number;          // ID único (auto-incremento)
  customer_id: number;       // ID do cliente
  ds_model: string;          // Modelo do veículo
  ds_color: string;          // Cor do veículo
  dt_year: number;           // Ano do veículo
  ds_plate: string;          // Placa (máx 7 caracteres)
  qtd_repair: number;        // Quantidade de reparos
  qtd_painting: number;      // Quantidade de pinturas
  dt_order: Date;            // Data do pedido
  dt_completion: Date;       // Data prevista de conclusão
  dt_delivered: Date;        // Data de entrega
  bt_delivered: boolean;     // Flag de entrega
  ds_services: string;       // Descrição dos serviços
  status_id: number;         // ID do status (default: 1)
  priority_id: number;       // ID da prioridade
  vl_total: number;          // Valor total (Decimal)
  enterprise_id: number;     // ID da empresa
  customer: Customer;       // Relação com cliente
  enterprise: Enterprise;    // Relação com empresa
  priority: Priority;        // Relação com prioridade
  status: StatusOrder;       // Relação com status
  payments: Payment[];       // Relação com pagamentos
}
```

#### 2.3. Payments (Pagamentos)
```typescript
{
  payment_id: number;        // ID único (auto-incremento)
  order_id: number;          // ID da ordem (único)
  vl_total: number;          // Valor total (Decimal)
  vl_payment: number;        // Valor pago (Decimal)
  vl_reamining: number;      // Valor restante (Decimal)
  ds_payment: string;        // Descrição do pagamento
  order: Order;              // Relação com ordem
}
```

#### 2.4. Enterprises (Empresas)
```typescript
{
  enterprise_id: number;    // ID único (auto-incremento)
  nm_enterprise: string;     // Nome da empresa (máx 200 caracteres)
  ep_fantasy: string;        // Nome fantasia (máx 200 caracteres)
  ep_cnpj: string;           // CNPJ (máx 19 caracteres)
  orders: Order[];           // Relação com ordens
  users: User[];             // Relação com usuários
}
```

#### 2.5. Users (Usuários)
```typescript
{
  user_id: number;           // ID único (auto-incremento)
  nm_user: string;           // Nome do usuário
  ds_email: string;          // Email
  ds_senha: string;          // Senha
  enterprise_id: number;      // ID da empresa
  enterprise: Enterprise;    // Relação com empresa
}
```

#### 2.6. Priority (Prioridades)
```typescript
{
  priority_id: number;       // ID único (auto-incremento)
  ds_priority: "BAIXA" | "MEDIA" | "ALTA";  // Tipo de prioridade
  orders: Order[];           // Relação com ordens
}
```

#### 2.7. StatusOrder (Status de Ordem)
```typescript
{
  status_id: number;         // ID único (auto-incremento)
  ds_status: "RECEBIDO" | "ORCAMENTO" | "APROVADO" | "ANDAMENTO" | 
             "AGUARDANDO_PECA" | "FINALIZADO" | "ENTREGUE";
  orders: Order[];           // Relação com ordens
}
```

**Mapeamento de Status:**
- 1: RECEBIDO
- 2: ORCAMENTO
- 3: APROVADO
- 4: ANDAMENTO
- 5: AGUARDANDO_PECA
- 6: FINALIZADO
- 7: ENTREGUE

---

### 3. Endpoints da API

#### 3.1. Customers (Clientes)

##### GET `/customers`
Lista todos os clientes com paginação.

**Query Parameters:**
- `page` (number, opcional): Número da página
- `limit` (number, opcional): Itens por página

**Resposta:**
```json
{
  "items": [
    {
      "customers_id": 1,
      "nm_customer": "João Silva",
      "ds_phone": "(11) 99999-9999",
      "ds_mail": "joao@email.com",
      "nm_cpf": "123.456.789-00"
    }
  ],
  "totalItems": 100
}
```

##### GET `/customers/:id`
Busca um cliente específico por ID.

**Resposta:**
```json
{
  "customers_id": 1,
  "nm_customer": "João Silva",
  "ds_phone": "(11) 99999-9999",
  "ds_mail": "joao@email.com",
  "nm_cpf": "123.456.789-00"
}
```

##### POST `/customers`
Cria um novo cliente.

**Body:**
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "email": "joao@email.com",
  "cpf": "123.456.789-00"
}
```

**Resposta:**
```json
{
  "message": "Cliente cadastrado com sucesso",
  "id": 1
}
```

**Validações:**
- CPF deve ser único (não pode haver duplicatas)
- Todos os campos são obrigatórios

##### PUT `/customers/:id`
Atualiza um cliente existente.

**Body:** (mesmo formato do POST)

**Resposta:**
```json
{
  "message": "Cliente atualizado com sucesso"
}
```

##### DELETE `/customers/:id`
Deleta um cliente.

**Resposta:**
```json
{
  "message": "Cliente excluído com sucesso"
}
```

**Regras:**
- Não permite deletar cliente vinculado a uma ordem

---

#### 3.2. Orders (Ordens de Serviço)

##### GET `/orders`
Lista todas as ordens com paginação, ordenadas por data de pedido (mais recentes primeiro).

**Query Parameters:**
- `page` (number, opcional): Número da página
- `limit` (number, opcional): Itens por página

**Resposta:**
```json
{
  "items": [
    {
      "order_id": 1,
      "customer_id": 1,
      "ds_model": "Civic",
      "ds_color": "Branco",
      "dt_year": 2020,
      "ds_plate": "ABC1234",
      "qtd_repair": 2,
      "qtd_painting": 1,
      "dt_order": "2024-01-15T10:00:00.000Z",
      "dt_completion": "2024-01-20T10:00:00.000Z",
      "dt_delivered": null,
      "bt_delivered": false,
      "ds_services": "Pintura e reparo",
      "status_id": 1,
      "priority_id": 2,
      "vl_total": 1500.00,
      "enterprise_id": 1
    }
  ],
  "totalItems": 50
}
```

##### GET `/orders/:id`
Busca uma ordem específica por ID.

**Resposta:**
```json
{
  "order_id": 1,
  "customer_id": 1,
  // ... todos os campos da ordem
}
```

**Erro (404):**
```json
{
  "message": "Ordem de serviço não encontrada"
}
```

##### GET `/orders/late`
Lista ordens atrasadas (data de conclusão passada e status diferente de FINALIZADO/ENTREGUE).

**Query Parameters:**
- `page` (number, opcional)
- `limit` (number, opcional)

**Resposta:** (mesmo formato do GET `/orders`)

##### GET `/orders/late/count`
Retorna a contagem total de ordens atrasadas.

**Resposta:**
```json
{
  "total": 5
}
```

##### GET `/orders/pendingPainting`
Retorna a quantidade total de peças pendentes de pintura (soma de `qtd_painting` + `qtd_repair` de ordens com status < 6).

**Resposta:**
```json
15
```

##### GET `/orders/proxLate`
Lista ordens próximas de expirar (data de conclusão entre hoje e 2 dias).

**Resposta:**
```json
[
  {
    "order_id": 1,
    // ... campos da ordem
  }
]
```

##### GET `/orders/deliveryItems`
Retorna quantidade de peças entregues no mês atual (soma de `qtd_painting` + `qtd_repair` de ordens entregues no mês).

**Resposta:**
```json
42
```

##### POST `/orders`
Cria uma nova ordem de serviço.

**Body:**
```json
{
  "customerId": 1,
  "dsModel": "Civic",
  "dsColor": "Branco",
  "dtYear": 2020,
  "dsPlate": "ABC1234",
  "qtdRepair": 2,
  "qtdPainting": 1,
  "dtOrder": "2024-01-15T10:00:00.000Z",
  "dtCompletion": "2024-01-20T10:00:00.000Z",
  "dsServices": "Pintura e reparo",
  "priorityId": 2,
  "vlTotal": 1500.00,
  "enterpriseId": 1
}
```

**Validações:**
- `customerId`: número mínimo 1
- `dsModel`: string mínima 1 caractere
- `dsColor`: string mínima 1 caractere
- `dtYear`: número entre 1900 e ano atual + 1
- `dsPlate`: string mínima 1 caractere
- `qtdRepair`: número mínimo 0
- `qtdPainting`: número mínimo 0
- `dtOrder`: data válida
- `dtCompletion`: data válida
- `dsServices`: string mínima 1 caractere
- `priorityId`: número mínimo 1
- `vlTotal`: número mínimo 0
- `enterpriseId`: número mínimo 1

##### PUT `/orders/:id`
Atualiza uma ordem de serviço existente.

**Body:** (mesmo formato do POST)

**Resposta:**
```json
{
  "message": "Ordem de serviço alterada com sucesso",
  "order": { /* ordem atualizada */ }
}
```

##### PUT `/orders/alterStatus/:id`
Altera o status de uma ordem.

**Body:**
```json
{
  "status": 3
}
```

**Validações:**
- Status deve ser um número válido (1-7)

**Resposta:**
```json
{
  "message": "Status atualizado com sucesso",
  "order": { /* ordem atualizada */ }
}
```

**Regras Especiais:**
- Se status for 7 (ENTREGUE), a ordem é automaticamente finalizada (chama `finalizeOrder`)

##### PUT `/orders/finalize/:id`
Finaliza uma ordem (marca como entregue).

**Resposta:**
```json
{
  "message": "Ordem de serviço finalizada com sucesso",
  "order": { /* ordem atualizada */ }
}
```

**Regras:**
- Define `status_id` como 7
- Define `bt_delivered` como `true`
- Define `dt_delivered` como data atual menos 3 horas (ajuste de timezone)

##### PUT `/orders/alterCompletion/:id`
Altera a data de conclusão prevista de uma ordem.

**Body:**
```json
{
  "dtCompletion": "2024-01-25T10:00:00.000Z"
}
```

**Resposta:**
```json
{
  "message": "Data de conclusão alterada com sucesso",
  "order": { /* ordem atualizada */ }
}
```

##### DELETE `/orders/:id`
Deleta uma ordem de serviço.

**Resposta:**
```json
{
  "message": "Ordem de serviço deletada com sucesso"
}
```

---

#### 3.3. Payments (Pagamentos)

##### GET `/payments`
Lista todos os pagamentos.

**Resposta:**
```json
[
  {
    "payment_id": 1,
    "order_id": 1,
    "vl_total": 1500.00,
    "vl_payment": 500.00,
    "vl_reamining": 1000.00,
    "ds_payment": null
  }
]
```

##### GET `/payments/total`
Retorna o total de pagamentos e contagem.

**Resposta:**
```json
{
  "_sum": {
    "vl_payment": 50000.00
  },
  "_count": {
    "payment_id": 25
  }
}
```

##### POST `/payment/:orderId`
Cria ou atualiza um pagamento para uma ordem.

**Body:**
```json
{
  "payment": 500.00
}
```

**Resposta:**
```json
{
  "message": "Pagamento criado com sucesso",
  "payment": {
    "payment_id": 1,
    "order_id": 1,
    "vl_total": 1500.00,
    "vl_payment": 500.00,
    "vl_reamining": 1000.00
  }
}
```

**Regras:**
- Se já existe pagamento para a ordem, adiciona ao valor existente
- Se não existe, cria novo pagamento
- `vl_reamining` = `vl_total` - `vl_payment`
- Valida que o pagamento não excede o valor total

##### PUT `/payment/:id`
Atualiza um pagamento existente (adiciona valor ao pagamento atual).

**Body:**
```json
{
  "payment": 200.00
}
```

**Resposta:**
```json
{
  "message": "Pagamento alterado com sucesso",
  "payment": { /* pagamento atualizado */ }
}
```

**Regras:**
- Adiciona o valor informado ao `vl_payment` atual
- Subtrai o valor informado do `vl_reamining`

##### DELETE `/payment/:id`
Deleta um pagamento.

**Resposta:**
```json
{
  "message": "Pagamento deletado com sucesso",
  "payment": { /* pagamento deletado */ }
}
```

---

#### 3.4. Enterprises (Empresas)

##### GET `/enterprises`
Lista todas as empresas.

**Resposta:**
```json
[
  {
    "enterprise_id": 1,
    "nm_enterprise": "Oficina ABC",
    "ep_fantasy": "ABC Auto",
    "ep_cnpj": "12.345.678/0001-90"
  }
]
```

##### POST `/enterprises`
Cria uma nova empresa.

**Body:**
```json
{
  "nm_enterprise": "Oficina ABC",
  "ep_fantasy": "ABC Auto",
  "ep_cnpj": "12.345.678/0001-90"
}
```

---

#### 3.5. Users (Usuários)

##### GET `/users`
Lista todos os usuários.

**Resposta:**
```json
[
  {
    "user_id": 1,
    "nm_user": "Admin",
    "ds_email": "admin@email.com",
    "ds_senha": "***",
    "enterprise_id": 1
  }
]
```

---

#### 3.6. Priority (Prioridades)

##### GET `/priority`
Lista todas as prioridades.

**Resposta:**
```json
[
  {
    "priority_id": 1,
    "ds_priority": "BAIXA"
  },
  {
    "priority_id": 2,
    "ds_priority": "MEDIA"
  },
  {
    "priority_id": 3,
    "ds_priority": "ALTA"
  }
]
```

##### POST `/priority`
Cria uma nova prioridade.

**Body:**
```json
{
  "ds_priority": "BAIXA"
}
```

---

#### 3.7. StatusOrder (Status de Ordem)

##### GET `/statusOrder`
Lista todos os status de ordem.

**Resposta:**
```json
[
  {
    "status_id": 1,
    "ds_status": "RECEBIDO"
  },
  {
    "status_id": 2,
    "ds_status": "ORCAMENTO"
  },
  {
    "status_id": 3,
    "ds_status": "APROVADO"
  },
  {
    "status_id": 4,
    "ds_status": "ANDAMENTO"
  },
  {
    "status_id": 5,
    "ds_status": "AGUARDANDO_PECA"
  },
  {
    "status_id": 6,
    "ds_status": "FINALIZADO"
  },
  {
    "status_id": 7,
    "ds_status": "ENTREGUE"
  }
]
```

##### POST `/statusOrder`
Cria um novo status de ordem.

**Body:**
```json
{
  "status": "RECEBIDO"
}
```

---

### 4. Funcionalidades Principais do Frontend

#### 4.1. Dashboard
- **Métricas principais:**
  - Total de ordens atrasadas (`/orders/late/count`)
  - Peças pendentes de pintura (`/orders/pendingPainting`)
  - Peças entregues no mês (`/orders/deliveryItems`)
  - Total de pagamentos recebidos (`/payments/total`)

- **Listas:**
  - Ordens atrasadas (`/orders/late`)
  - Ordens próximas de expirar (`/orders/proxLate`)

#### 4.2. Gestão de Ordens
- Listar ordens com paginação
- Criar nova ordem
- Visualizar detalhes da ordem
- Editar ordem
- Alterar status da ordem
- Alterar data de conclusão
- Finalizar ordem
- Deletar ordem
- Filtros por status, prioridade, cliente, data

#### 4.3. Gestão de Clientes
- Listar clientes com paginação
- Criar novo cliente
- Visualizar detalhes do cliente
- Editar cliente
- Deletar cliente (com validação de vínculo)
- Busca por nome, CPF, email

#### 4.4. Gestão de Pagamentos
- Listar pagamentos
- Criar/atualizar pagamento para ordem
- Visualizar histórico de pagamentos
- Deletar pagamento
- Exibir saldo restante por ordem

#### 4.5. Gestão de Empresas
- Listar empresas
- Criar empresa

#### 4.6. Gestão de Usuários
- Listar usuários

#### 4.7. Configurações
- Gerenciar prioridades
- Gerenciar status de ordem

---

### 5. Regras de Negócio Importantes

1. **Clientes:**
   - CPF deve ser único no sistema
   - Não pode deletar cliente vinculado a uma ordem

2. **Ordens:**
   - Status padrão ao criar: 1 (RECEBIDO)
   - Ao alterar status para 7 (ENTREGUE), a ordem é automaticamente finalizada
   - Ordens atrasadas: `dt_completion < hoje` E `status_id NOT IN [6, 7]`
   - Ordens próximas de expirar: `dt_completion` entre hoje e 2 dias

3. **Pagamentos:**
   - Uma ordem pode ter apenas um registro de pagamento (relação 1:1)
   - Se já existe pagamento, novos valores são somados ao existente
   - `vl_reamining` é calculado automaticamente
   - Validação: pagamento não pode exceder valor total da ordem

4. **Prioridades:**
   - Valores possíveis: BAIXA, MEDIA, ALTA

5. **Status:**
   - Fluxo sugerido: RECEBIDO → ORCAMENTO → APROVADO → ANDAMENTO → AGUARDANDO_PECA → FINALIZADO → ENTREGUE

---

### 6. Tratamento de Erros

A API retorna erros no formato:
```json
{
  "message": "Mensagem de erro"
}
```

**Erros comuns:**
- 404: Recurso não encontrado
- 400: Dados inválidos (validação)
- 500: Erro interno do servidor

**Mensagens específicas:**
- "Cliente já cadastrado" - ao tentar criar cliente com CPF duplicado
- "Cliente vinculado a um pedido, não pode ser excluído" - ao tentar deletar cliente com ordens
- "Ordem de serviço não encontrada" - ao buscar/atualizar/deletar ordem inexistente

---

### 7. Paginação

Todos os endpoints de listagem suportam paginação via query parameters:
- `page`: Número da página (começa em 1)
- `limit`: Itens por página

**Resposta padrão:**
```json
{
  "items": [...],
  "totalItems": 100
}
```

---

### 8. Formato de Datas

A API utiliza formato ISO 8601 para datas:
- `"2024-01-15T10:00:00.000Z"`

**Nota:** Ao finalizar uma ordem, a data de entrega é ajustada para 3 horas antes (timezone).

---

### 9. Requisitos Técnicos do Frontend

#### 9.1. Tecnologias Recomendadas
- React, Vue.js ou Angular
- TypeScript (recomendado)
- Biblioteca de requisições HTTP (axios, fetch)
- Biblioteca de formulários (react-hook-form, formik)
- Biblioteca de validação (zod, yup)
- Biblioteca de UI (Material-UI, Ant Design, Chakra UI)
- Gerenciamento de estado (Redux, Zustand, Context API)
- Roteamento (React Router, Vue Router)

#### 9.2. Estrutura de Pastas Sugerida
```
src/
  components/
    Dashboard/
    Orders/
    Customers/
    Payments/
    Common/
  services/
    api.ts
    orders.ts
    customers.ts
    payments.ts
  types/
    order.ts
    customer.ts
    payment.ts
  hooks/
    useOrders.ts
    useCustomers.ts
  utils/
    formatters.ts
    validators.ts
```

#### 9.3. Funcionalidades de UX Recomendadas
- Loading states em todas as requisições
- Mensagens de erro amigáveis
- Confirmação antes de deletar
- Validação de formulários em tempo real
- Feedback visual de ações (toast notifications)
- Filtros e busca avançada
- Exportação de dados (opcional)
- Gráficos e visualizações (opcional)

---

### 10. Exemplos de Uso

#### 10.1. Criar uma Ordem Completa
1. Buscar ou criar cliente (`GET /customers` ou `POST /customers`)
2. Buscar prioridades (`GET /priority`)
3. Buscar status (`GET /statusOrder`)
4. Criar ordem (`POST /orders`)
5. Criar pagamento inicial (`POST /payment/:orderId`)

#### 10.2. Dashboard
1. Buscar métricas em paralelo:
   - `GET /orders/late/count`
   - `GET /orders/pendingPainting`
   - `GET /orders/deliveryItems`
   - `GET /payments/total`
2. Buscar listas:
   - `GET /orders/late?page=1&limit=10`
   - `GET /orders/proxLate`

---

### 11. Notas Finais

- A API não possui autenticação implementada (considerar adicionar no frontend)
- CORS está habilitado no backend
- Todas as datas são em UTC
- Valores monetários são do tipo Decimal (tratar como número no frontend)
- Campos opcionais podem retornar `null`

---

### 12. Checklist de Implementação

- [ ] Configurar cliente HTTP (axios/fetch)
- [ ] Criar tipos TypeScript baseados nos modelos
- [ ] Implementar serviços de API para cada módulo
- [ ] Criar componentes de Dashboard
- [ ] Implementar CRUD de Ordens
- [ ] Implementar CRUD de Clientes
- [ ] Implementar gestão de Pagamentos
- [ ] Implementar listagem de Empresas e Usuários
- [ ] Adicionar tratamento de erros global
- [ ] Implementar loading states
- [ ] Adicionar validação de formulários
- [ ] Implementar paginação
- [ ] Adicionar filtros e busca
- [ ] Testar todos os fluxos principais

---

**Versão do Documento:** 1.0  
**Data:** 2024  
**Autor:** Baseado na análise do backend dvCar

