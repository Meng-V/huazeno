# 1. 依赖安装阶段
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# 如果在国内 ECS 打包，建议切换为阿里云镜像源，速度极快
RUN npm config set registry https://npmmirror.com
COPY package.json package-lock.json ./
RUN npm ci

# 2. 编译构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 同样切换镜像源
RUN npm config set registry https://npmmirror.com
RUN npm run build

# 3. 生产运行阶段
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]