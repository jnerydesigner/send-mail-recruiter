# Use uma imagem oficial do Node.js como base
FROM node:18-alpine AS builder

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package.json yarn.lock ./

# Instale as dependências com Yarn
RUN yarn install --frozen-lockfile

# Copie o restante do código
COPY . .

# Compile a aplicação (NestJS usa TypeScript)
RUN yarn build

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

# Copie apenas as dependências de produção e o código compilado
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

# Instale apenas dependências de produção
RUN yarn install --production --frozen-lockfile

# Exponha a porta que o NestJS usa (padrão: 3000)
EXPOSE 5544

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]