# Dockerfile
FROM node:22-alpine

WORKDIR /app

RUN addgroup -g 1001 -S appgrop && \
    adduser -S appuser -u 1001

COPY ./package*.json ./

RUN npm install -g pnpm && \
    pnpm install --prod

COPY . .

RUN chown -R appuser:appgrop /app
USER appuser

ENV PATH=/usr/local/bin:$PATH

EXPOSE 3000
CMD ["npm", "start"]
