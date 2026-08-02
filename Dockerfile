# 1. 依赖安装阶段
FROM docker.1ms.run/library/node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 修正这里
RUN npm config set registry https://npmmirror.com
COPY package.json package-lock.json ./
RUN npm i

# 2. 编译构建阶段
FROM docker.1ms.run/library/node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 修正这里
RUN npm config set registry https://npmmirror.com
RUN npm run build

# 3. 生产运行阶段
FROM docker.1ms.run/library/node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs || true
RUN adduser --system --uid 1001 nextjs || true

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]