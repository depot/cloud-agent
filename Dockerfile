FROM node:18-slim AS base

RUN apt-get update && apt-get install -y ca-certificates openssl && rm -rf /var/lib/apt/lists/*

FROM base AS build

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS dependencies

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production

FROM base

WORKDIR /app
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ARG CLOUD_AGENT_VERSION=dev
ENV CLOUD_AGENT_VERSION=${CLOUD_AGENT_VERSION}

CMD [ "node", "dist/index.js" ]
