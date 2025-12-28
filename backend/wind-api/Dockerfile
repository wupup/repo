# Dockerfile
FROM node:22-alpine AS builer

WORKDIR /app

COPY ./package*.json ./

RUN npm install -g pnpm && \
    pnpm install --prod

COPY . .

RUN pnpx prisma migrate deploy

# 如果需要构建
# RUN pnpm run build


FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S appgrop && \
    adduser -S appuser -u 1001

RUN chown -R appuser:appgrop /app

USER appuser

COPY --from=builer /app .

ENV PATH=/usr/local/bin:$PATH

EXPOSE 3000
CMD ["npm", "start"]
