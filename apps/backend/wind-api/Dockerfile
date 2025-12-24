# Dockerfile
FROM node:22-alpine

WORKDIR /dist

COPY ./package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY dist/ .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S mock_api -u 1001 && \
    chown -R mock_api:nodejs /dist
USER mock_api

EXPOSE 3000
CMD ["node", "dist/index.esm.js"]  # 替换为你的入口文件
