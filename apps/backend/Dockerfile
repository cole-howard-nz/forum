FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --only=production && \
    npm install -D typescript ts-node @types/node

COPY prisma ./prisma

RUN npx prisma generate

COPY src ./src

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]