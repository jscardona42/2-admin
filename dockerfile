FROM node:14-alpine AS builder


WORKDIR /app

COPY ./package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/run.sh ./run.sh
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/prisma ./prisma/

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

EXPOSE 3000

CMD wait && sh run.sh
