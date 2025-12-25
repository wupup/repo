# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm ci --only=production && npm cache clean --force && npm install --production

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S wind-user -u 1001 && \
    chown -R wind-user:nodejs /dist
USER wind-user

EXPOSE 3000
CMD ["node", "./bin/www"]  # 替换为你的入口文件
