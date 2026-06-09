# --- Build stage ---
FROM node:20-bookworm-slim AS build

# Toolchain para compilar dependencias nativas opcionales (bufferutil, etc.)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# --- Runtime stage ---
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV UPLOADS_DIR=/app/uploads

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

RUN mkdir -p /app/uploads

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
