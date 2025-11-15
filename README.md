# RepairControl - Backend

Sistema de gestão integrado para oficinas mecânicas, desenvolvido para otimizar processos operacionais e administrativos.

## 📋 Sobre o Projeto

O RepairControl é uma solução tecnológica especializada que automatiza e organiza o fluxo de trabalho de oficinas mecânicas de pequeno e médio porte. O backend oferece uma API RESTful robusta para gerenciar clientes, veículos, ordens de serviço, pagamentos e relatórios gerenciais.

### Principais Funcionalidades

- **Gestão de Clientes e Veículos**: Cadastro completo com informações de contato e histórico
- **Ordens de Serviço**: Criação, acompanhamento e controle de status em tempo real
- **Controle de Pagamentos**: Gerenciamento financeiro com suporte a pagamentos parciais
- **Sistema de Prioridades**: Classificação de serviços por urgência (Baixa, Média, Alta)
- **Multi-empresa**: Suporte para múltiplas empresas no mesmo sistema
- **Gestão de Usuários**: Controle de acesso e permissões por empresa
- **Relatórios e Dashboards**: Visualização de ordens atrasadas, pendentes e próximas entregas

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista e flexível
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma ORM** - ORM moderno para Node.js e TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas e tipagem em runtime
- **CORS** - Controle de acesso entre origens

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)
- **PostgreSQL** (versão 14.x ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** (para controle de versão)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/repaircontrol.git
cd repaircontrol
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/repaircontrol?schema=public"

# Server
PORT_SERVER=3000
NODE_ENV=development
```

### 4. Execute as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. (Opcional) Popule o banco com dados iniciais

```bash
npx prisma db seed
```

### 6. Inicie o servidor

**Modo desenvolvimento:**
```bash
npm run dev
```

**Modo produção:**
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida em `PORT_SERVER`)

## 📊 Estrutura do Banco de Dados

### Entidades Principais

#### **customers** (Clientes)
- `customers_id` (Int, PK) - Identificador único
- `nm_customer` (String) - Nome do cliente
- `ds_phone` (String, max 19) - Telefone de contato
- `ds_mail` (String) - Email
- `nm_cpf` (String, max 14) - CPF
- Relacionamento: `orders[]` - Ordens de serviço do cliente

#### **enterprises** (Empresas)
- `enterprise_id` (Int, PK) - Identificador único
- `nm_enterprise` (String, max 200) - Razão social
- `ep_fantasy` (String, max 200) - Nome fantasia
- `ep_cnpj` (String, max 19) - CNPJ
- Relacionamentos: `orders[]`, `users[]`

#### **users** (Usuários)
- `user_id` (Int, PK) - Identificador único
- `nm_user` (String) - Nome do usuário
- `ds_email` (String) - Email
- `ds_senha` (String) - Senha
- `enterprise_id` (Int, FK) - Empresa vinculada
- Relacionamento: `enterprise` - Empresa do usuário

#### **orders** (Ordens de Serviço)
- `order_id` (Int, PK) - Identificador único
- `customer_id` (Int, FK) - Cliente vinculado
- `ds_model` (String) - Modelo do veículo
- `ds_color` (String) - Cor do veículo
- `dt_year` (Int) - Ano do veículo
- `ds_plate` (String, max 7) - Placa do veículo
- `qtd_repair` (Int) - Quantidade de reparos
- `qtd_painting` (Int) - Quantidade de pinturas
- `dt_order` (DateTime) - Data do pedido
- `dt_completion` (DateTime) - Data de conclusão prevista
- `dt_delivered` (DateTime) - Data de entrega
- `bt_delivered` (Boolean) - Flag de entrega
- `ds_services` (String) - Descrição dos serviços
- `status_id` (Int, FK, default: 1) - Status da ordem
- `priority_id` (Int, FK) - Prioridade
- `vl_total` (Decimal) - Valor total
- `enterprise_id` (Int, FK) - Empresa vinculada
- Relacionamentos: `customer`, `enterprise`, `priority`, `status`, `payments[]`

#### **payments** (Pagamentos)
- `payment_id` (Int, PK) - Identificador único
- `order_id` (Int, FK, Unique) - Ordem de serviço vinculada
- `vl_total` (Decimal) - Valor total
- `vl_payment` (Decimal) - Valor pago
- `vl_reamining` (Decimal) - Valor restante
- `ds_payment` (String) - Forma de pagamento
- Relacionamento: `order` - Ordem de serviço

#### **priority** (Prioridades)
- `priority_id` (Int, PK) - Identificador único
- `ds_priority` (priority_enum) - Tipo de prioridade
- Relacionamento: `orders[]`

**Enum priority_enum:**
- `BAIXA` - Prioridade baixa
- `MEDIA` - Prioridade média
- `ALTA` - Prioridade alta

#### **statusOrder** (Status das Ordens)
- `status_id` (Int, PK) - Identificador único
- `ds_status` (statusOrder_enum) - Status da ordem
- Relacionamento: `orders[]`

**Enum statusOrder_enum:**
- `RECEBIDO` - Ordem recebida
- `ORCAMENTO` - Em orçamento
- `APROVADO` - Orçamento aprovado
- `ANDAMENTO` - Em andamento
- `AGUARDANDO_PECA` - Aguardando peça
- `FINALIZADO` - Finalizado
- `ENTREGUE` - Entregue

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas, promovendo separação de responsabilidades e facilitando manutenção:

### **Camada de Controle (Controllers)**
Responsável por receber requisições HTTP, validar dados de entrada e orquestrar as respostas.

- `CustomersController.ts` - Gerenciamento de clientes
- `EnterprisesController.ts` - Gerenciamento de empresas
- `OrdersController.ts` - Gerenciamento de ordens de serviço
- `PaymentsController.ts` - Gerenciamento de pagamentos
- `PriorityController.ts` - Gerenciamento de prioridades
- `StatusOrderController.ts` - Gerenciamento de status
- `UsersController.ts` - Gerenciamento de usuários

### **Camada de Serviço (Services)**
Contém a lógica de negócio e regras da aplicação, realizando operações no banco de dados através do Prisma.

- `CustomersService.ts` - Operações relacionadas a clientes
- `EnterprisesService.ts` - Operações relacionadas a empresas
- `OrdersService.ts` - Operações relacionadas a ordens de serviço
- `PaymentsService.ts` - Operações relacionadas a pagamentos
- `PriorityService.ts` - Gerenciamento de prioridades
- `StatusOrderService.ts` - Gerenciamento de status
- `UsersService.ts` - Gerenciamento de usuários

### **Camada de Validação (Validations)**
Utiliza Zod para validar dados de entrada, garantindo integridade e segurança.

- `customers/validData.ts` - Validações de dados de clientes
- `orders/validData.ts` - Validações de ordens de serviço
- `orders/validStatus.ts` - Validações de status
- `orders/validCompletionDate.ts` - Validações de data de conclusão
- `payments/validValuePayment.ts` - Validações de valores de pagamento
- `validPagination.ts` - Validações de paginação

### **Utilitários (Util)**
Funções auxiliares reutilizáveis em toda a aplicação.

- `convertPagination.ts` - Conversão e padronização de dados de paginação
- `converBodyOrder.ts` - Conversão de body de requisições de ordens

## 📡 Mapeamento Completo de Endpoints

### Base URL
```
http://localhost:3000
```

---

### 🔵 **Clientes (Customers)**

#### `GET /customers`
Lista todos os clientes com paginação.

**Query Parameters:**
- `page` (number, opcional) - Número da página
- `limit` (number, opcional) - Itens por página

**Resposta:**
```json
{
  "data": [
    {
      "customers_id": 1,
      "nm_customer": "João Silva",
      "ds_phone": "(11) 99999-9999",
      "ds_mail": "joao@email.com",
      "nm_cpf": "123.456.789-00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

#### `GET /customers/:id`
Busca um cliente específico por ID.

**Parâmetros de Rota:**
- `id` (number) - ID do cliente

**Resposta:**
```json
{
  "customers_id": 1,
  "nm_customer": "João Silva",
  "ds_phone": "(11) 99999-9999",
  "ds_mail": "joao@email.com",
  "nm_cpf": "123.456.789-00",
  "orders": []
}
```

---

#### `POST /customers`
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

**Validações:**
- `name`: mínimo 3 caracteres
- `phone`: mínimo 8, máximo 19 caracteres
- `email`: formato de email válido
- `cpf`: mínimo 11, máximo 14 caracteres

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

---

#### `PUT /customers/:id`
Atualiza um cliente existente.

**Parâmetros de Rota:**
- `id` (number) - ID do cliente

**Body:**
```json
{
  "name": "João Silva Santos",
  "phone": "(11) 88888-8888",
  "email": "joao.santos@email.com",
  "cpf": "123.456.789-00"
}
```

**Resposta:**
```json
{
  "customers_id": 1,
  "nm_customer": "João Silva Santos",
  "ds_phone": "(11) 88888-8888",
  "ds_mail": "joao.santos@email.com",
  "nm_cpf": "123.456.789-00"
}
```

---

#### `DELETE /customers/:id`
Remove um cliente.

**Parâmetros de Rota:**
- `id` (number) - ID do cliente

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

---

### 🟢 **Empresas (Enterprises)**

#### `GET /enterprises`
Lista todas as empresas.

**Resposta:**
```json
[
  {
    "enterprise_id": 1,
    "nm_enterprise": "Oficina ABC Ltda",
    "ep_fantasy": "Oficina ABC",
    "ep_cnpj": "12.345.678/0001-90"
  }
]
```

---

#### `POST /enterprises`
Cria uma nova empresa.

**Body:**
```json
{
  "nm_enterprise": "Oficina ABC Ltda",
  "ep_fantasy": "Oficina ABC",
  "ep_cnpj": "12.345.678/0001-90"
}
```

**Resposta:**
```json
{
  "enterprise_id": 1,
  "nm_enterprise": "Oficina ABC Ltda",
  "ep_fantasy": "Oficina ABC",
  "ep_cnpj": "12.345.678/0001-90"
}
```

---

### 🟡 **Ordens de Serviço (Orders)**

#### `GET /orders`
Lista todas as ordens de serviço com paginação.

**Query Parameters:**
- `page` (number, opcional) - Número da página
- `limit` (number, opcional) - Itens por página

**Resposta:**
```json
{
  "data": [
    {
      "order_id": 1,
      "customer_id": 1,
      "ds_model": "Civic",
      "ds_color": "Branco",
      "dt_year": 2020,
      "ds_plate": "ABC1234",
      "qtd_repair": 2,
      "qtd_painting": 1,
      "dt_order": "2024-01-15T10:00:00Z",
      "dt_completion": "2024-01-20T18:00:00Z",
      "dt_delivered": null,
      "bt_delivered": false,
      "ds_services": "Troca de óleo e pintura",
      "status_id": 1,
      "priority_id": 2,
      "vl_total": 1500.00,
      "enterprise_id": 1,
      "customer": {...},
      "status": {...},
      "priority": {...},
      "enterprise": {...}
    }
  ],
  "pagination": {...}
}
```

---

#### `GET /orders/:id`
Busca uma ordem de serviço específica por ID.

**Parâmetros de Rota:**
- `id` (number) - ID da ordem

**Resposta:**
```json
{
  "order_id": 1,
  "customer_id": 1,
  "ds_model": "Civic",
  "ds_color": "Branco",
  "dt_year": 2020,
  "ds_plate": "ABC1234",
  "qtd_repair": 2,
  "qtd_painting": 1,
  "dt_order": "2024-01-15T10:00:00Z",
  "dt_completion": "2024-01-20T18:00:00Z",
  "dt_delivered": null,
  "bt_delivered": false,
  "ds_services": "Troca de óleo e pintura",
  "status_id": 1,
  "priority_id": 2,
  "vl_total": 1500.00,
  "enterprise_id": 1,
  "customer": {...},
  "status": {...},
  "priority": {...},
  "enterprise": {...},
  "payments": [...]
}
```

---

#### `GET /orders/late`
Lista ordens de serviço atrasadas com paginação.

**Query Parameters:**
- `page` (number, opcional) - Número da página
- `limit` (number, opcional) - Itens por página

**Resposta:**
```json
{
  "data": [...],
  "pagination": {...}
}
```

---

#### `GET /orders/late/count`
Retorna o total de ordens atrasadas.

**Resposta:**
```json
{
  "total": 5
}
```

---

#### `GET /orders/pendingPainting`
Lista ordens pendentes de pintura.

**Resposta:**
```json
[
  {
    "order_id": 1,
    "ds_model": "Civic",
    "ds_plate": "ABC1234",
    "qtd_painting": 1,
    ...
  }
]
```

---

#### `GET /orders/proxLate`
Lista ordens próximas de atrasar.

**Resposta:**
```json
[
  {
    "order_id": 2,
    "ds_model": "Corolla",
    "ds_plate": "XYZ5678",
    "dt_completion": "2024-01-22T18:00:00Z",
    ...
  }
]
```

---

#### `GET /orders/deliveryItems`
Lista itens prontos para entrega.

**Resposta:**
```json
[
  {
    "order_id": 3,
    "ds_model": "Fusca",
    "ds_plate": "DEF9012",
    "bt_delivered": false,
    "status": {
      "ds_status": "FINALIZADO"
    },
    ...
  }
]
```

---

#### `POST /orders`
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
  "dtOrder": "2024-01-15T10:00:00Z",
  "dtCompletion": "2024-01-20T18:00:00Z",
  "dsServices": "Troca de óleo e pintura",
  "priorityId": 2,
  "vlTotal": 1500.00,
  "enterpriseId": 1
}
```

**Validações:**
- `customerId`: número mínimo 1
- `dsModel`: string mínimo 1 caractere
- `dsColor`: string mínimo 1 caractere
- `dtYear`: número entre 1900 e ano atual + 1
- `dsPlate`: string mínimo 1 caractere
- `qtdRepair`: número mínimo 0
- `qtdPainting`: número mínimo 0
- `dtOrder`: data válida
- `dtCompletion`: data válida
- `dsServices`: string mínimo 1 caractere
- `priorityId`: número mínimo 1
- `vlTotal`: número mínimo 0
- `enterpriseId`: número mínimo 1

**Resposta:**
```json
{
  "order_id": 1,
  "customer_id": 1,
  "ds_model": "Civic",
  ...
}
```

---

#### `PUT /orders/:id`
Atualiza uma ordem de serviço existente.

**Parâmetros de Rota:**
- `id` (number) - ID da ordem

**Body:**
```json
{
  "customerId": 1,
  "dsModel": "Civic",
  "dsColor": "Preto",
  "dtYear": 2020,
  "dsPlate": "ABC1234",
  "qtdRepair": 3,
  "qtdPainting": 1,
  "dtOrder": "2024-01-15T10:00:00Z",
  "dtCompletion": "2024-01-25T18:00:00Z",
  "dsServices": "Troca de óleo, filtros e pintura",
  "priorityId": 3,
  "vlTotal": 2000.00,
  "enterpriseId": 1
}
```

**Resposta:**
```json
{
  "order_id": 1,
  ...
}
```

---

#### `PUT /orders/alterStatus/:id`
Altera o status de uma ordem de serviço.

**Parâmetros de Rota:**
- `id` (number) - ID da ordem

**Body:**
```json
{
  "status": 2
}
```

**Resposta:**
```json
{
  "order_id": 1,
  "status_id": 2,
  "status": {
    "status_id": 2,
    "ds_status": "ORCAMENTO"
  },
  ...
}
```

---

#### `PUT /orders/finalize/:id`
Finaliza uma ordem de serviço.

**Parâmetros de Rota:**
- `id` (number) - ID da ordem

**Resposta:**
```json
{
  "order_id": 1,
  "status_id": 6,
  "status": {
    "status_id": 6,
    "ds_status": "FINALIZADO"
  },
  ...
}
```

---

#### `PUT /orders/alterCompletion/:id`
Altera a data de conclusão prevista de uma ordem.

**Parâmetros de Rota:**
- `id` (number) - ID da ordem

**Body:**
```json
{
  "dtCompletion": "2024-01-25T18:00:00Z"
}
```

**Resposta:**
```json
{
  "order_id": 1,
  "dt_completion": "2024-01-25T18:00:00Z",
  ...
}
```

---

#### `DELETE /orders/:id`
Remove uma ordem de serviço.

**Parâmetros de Rota:**
- `id` (number) - ID da ordem

**Resposta:**
```json
{
  "order_id": 1,
  ...
}
```

---

### 🟣 **Pagamentos (Payments)**

#### `GET /payments`
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
    "ds_payment": "Dinheiro",
    "order": {...}
  }
]
```

---

#### `GET /payments/total`
Retorna o total de pagamentos.

**Resposta:**
```json
{
  "total": 50000.00,
  "paid": 30000.00,
  "remaining": 20000.00
}
```

---

#### `POST /payment/:orderId`
Cria um novo pagamento para uma ordem.

**Parâmetros de Rota:**
- `orderId` (number) - ID da ordem de serviço

**Body:**
```json
{
  "payment": 500.00
}
```

**Resposta:**
```json
{
  "payment_id": 1,
  "order_id": 1,
  "vl_total": 1500.00,
  "vl_payment": 500.00,
  "vl_reamining": 1000.00,
  "ds_payment": null,
  "order": {...}
}
```

---

#### `PUT /payment/:id`
Atualiza um pagamento existente.

**Parâmetros de Rota:**
- `id` (number) - ID do pagamento

**Body:**
```json
{
  "payment": 1000.00
}
```

**Resposta:**
```json
{
  "payment_id": 1,
  "order_id": 1,
  "vl_total": 1500.00,
  "vl_payment": 1000.00,
  "vl_reamining": 500.00,
  "ds_payment": null,
  "order": {...}
}
```

---

#### `DELETE /payment/:id`
Remove um pagamento.

**Parâmetros de Rota:**
- `id` (number) - ID do pagamento

**Resposta:**
```json
{
  "message": "Pagamento deletado com sucesso",
  "payment": {
    "payment_id": 1,
    "order_id": 1,
    ...
  }
}
```

---

### 🟠 **Prioridades (Priority)**

#### `GET /priority`
Lista todas as prioridades disponíveis.

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

---

#### `POST /priority`
Cria uma nova prioridade.

**Body:**
```json
{
  "ds_priority": "ALTA"
}
```

**Resposta:**
```json
{
  "priority_id": 3,
  "ds_priority": "ALTA"
}
```

---

### 🔴 **Status de Ordens (StatusOrder)**

#### `GET /statusOrder`
Lista todos os status disponíveis.

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

---

#### `POST /statusOrder`
Cria um novo status.

**Body:**
```json
{
  "status": "ORCAMENTO"
}
```

**Resposta:**
```json
{
  "status_id": 2,
  "ds_status": "ORCAMENTO"
}
```

---

### ⚪ **Usuários (Users)**

#### `GET /users`
Lista todos os usuários.

**Resposta:**
```json
[
  {
    "user_id": 1,
    "nm_user": "Admin",
    "ds_email": "admin@oficina.com",
    "ds_senha": "***",
    "enterprise_id": 1,
    "enterprise": {
      "enterprise_id": 1,
      "nm_enterprise": "Oficina ABC Ltda",
      ...
    }
  }
]
```

---

## 🔐 Autenticação

Atualmente, o sistema não possui autenticação implementada. Recomenda-se implementar JWT ou OAuth2 para produção.

## 📝 Notas Importantes

1. **Paginação**: Endpoints que suportam paginação aceitam os parâmetros `page` e `limit` via query string.

2. **Datas**: Todas as datas devem ser enviadas no formato ISO 8601 (ex: `2024-01-15T10:00:00Z`).

3. **Valores Monetários**: Valores monetários são tratados como `Decimal` no banco de dados e devem ser enviados como números.

4. **Validações**: Todos os dados de entrada são validados usando Zod. Erros de validação retornam status 400.

5. **CORS**: O servidor está configurado para aceitar requisições de qualquer origem. Em produção, configure adequadamente.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Davi, Lorena, Douglas e Gerson** - *Desenvolvimento inicial*

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@repaircontrol.com.br

---

Desenvolvido com ❤️ para revolucionar a gestão de oficinas mecânicas
