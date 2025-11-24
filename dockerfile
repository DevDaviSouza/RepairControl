# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build


# Stage 2: production
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Render irá injetar as variáveis de ambiente
# NÃO copie .env

# Exponha a porta verdadeira da sua aplicação (alterar caso use outra)
EXPOSE 3801

# Rodar migrations + iniciar app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
