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

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista e flexível
- **TypeScript** - Superset JavaScript com tipagem estática
- **Prisma ORM** - ORM moderno para Node.js e TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas e tipagem em runtime

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
PORT=3000
NODE_ENV=development

# JWT (adicione conforme necessário)
JWT_SECRET=sua_chave_secreta_aqui
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

O servidor estará rodando em `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Entidades Principais

#### **customers** (Clientes)
- Informações pessoais e de contato
- CPF, telefone e email
- Relacionamento com ordens de serviço

#### **enterprises** (Empresas)
- Dados cadastrais (CNPJ, razão social, nome fantasia)
- Gerenciamento multi-tenant
- Vinculação com usuários e ordens

#### **users** (Usuários)
- Credenciais de acesso
- Associação com empresas
- Controle de permissões

#### **orders** (Ordens de Serviço)
- Dados do veículo (modelo, cor, ano, placa)
- Status do serviço (7 estados possíveis)
- Prioridade (Baixa, Média, Alta)
- Datas de registro, conclusão e entrega
- Valor total e descrição dos serviços

#### **payments** (Pagamentos)
- Valor total, pago e restante
- Forma de pagamento
- Vinculação com ordens de serviço

#### **priority** (Prioridades)
Enum: `BAIXA`, `MEDIA`, `ALTA`

#### **statusOrder** (Status das Ordens)
Enum: `RECEBIDO`, `ORCAMENTO`, `APROVADO`, `ANDAMENTO`, `AGUARDANDO_PECA`, `FINALIZADO`, `ENTREGUE`

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas, promovendo separação de responsabilidades e facilitando manutenção:

### **Camada de Controle (Controllers)**
Responsável por receber requisições HTTP, validar dados de entrada e orquestrar as respostas.

- `CustomersController.ts` - Gerenciamento de clientes
- `EnterprisesController.ts` - Gerenciamento de empresas
- `OrdersController.ts` - Gerenciamento de ordens de serviço
- `PaymentsController.ts` - Gerenciamento de pagamentos
- `UsersController.ts` - Gerenciamento de usuários

### **Camada de Serviço (Services)**
Contém a lógica de negócio e regras da aplicação, realizando operações no banco de dados através do Prisma.

- `CustomersService.ts` - Operações relacionadas a clientes
- `EnterprisesService.ts` - Operações relacionadas a empresas
- `OrdersService.ts` - Operações relacionadas a ordens de serviço
- `PriorityService.ts` - Gerenciamento de prioridades
- `UsersService.ts` - Autenticação e gerenciamento de usuários

### **Camada de Validação (Validations)**
Utiliza Zod para validar dados de entrada, garantindo integridade e segurança.

- `customers/` - Validações de dados de clientes e paginação
- `orders/` - Validações de ordens de serviço e rotas

### **Utilitários (Util)**
Funções auxiliares reutilizáveis em toda a aplicação.

- `convertPagination.ts` - Conversão e padronização de dados de paginação

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

- **Davi, Lorena, Douglas e Gerson ** - *Desenvolvimento inicial*

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@repaircontrol.com.br

---

Desenvolvido com ❤️ para revolucionar a gestão de oficinas mecânicas
