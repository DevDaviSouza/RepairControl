# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Build da aplicação TypeScript
RUN npm run build

# Etapa de produção
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expor a porta da aplicação
EXPOSE 3000

# Comando para rodar migrações e iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]