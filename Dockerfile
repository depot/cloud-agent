FROM node:16-alpine AS build

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:16-alpine AS dependencies

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production

FROM node:16-alpine

WORKDIR /app
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

CMD [ "node", "dist/index.js" ]
