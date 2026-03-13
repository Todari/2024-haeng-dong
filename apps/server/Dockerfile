# Use host platform for native build (remove --platform for EC2 compatibility)
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile --filter @haeng-dong/server...

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server
RUN cd packages/shared && pnpm build
RUN cd apps/server && rm -f tsconfig.build.tsbuildinfo && npx prisma generate && npx tsc -p tsconfig.build.json
RUN find /app/apps/server/dist -type f -name "*.js" | head -20

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Prisma CLI for migrate deploy (must match project: 6.x; 7.x breaks schema url)
RUN npm install -g prisma@6
# pnpm layout: root .pnpm store + server node_modules (symlinks point to ../../../node_modules/.pnpm)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/server ./apps/server
RUN test -f /app/apps/server/dist/main.js || (echo "Build failed: main.js missing" && find /app/apps/server/dist -type f 2>/dev/null && exit 1)
RUN chmod +x /app/apps/server/entrypoint.sh

EXPOSE 8080
CMD ["/app/apps/server/entrypoint.sh"]
