FROM ubuntu:22.04 AS base

RUN \
  apt-get update && \
  apt-get install -y ca-certificates curl openssl && \
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs && \
  curl --silent --remote-name --location https://download.ceph.com/rpm-18.2.2/el9/noarch/cephadm && \
  chmod +x cephadm && \
  ./cephadm add-repo --release reef && \
  ./cephadm install ceph-common && \
  rm -rf /var/lib/apt/lists/*

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
