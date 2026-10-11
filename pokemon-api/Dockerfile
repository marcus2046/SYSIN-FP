# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json** ./
RUN npm install

FROM deps AS test
COPY . .
RUN npm test

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json** ./
RUN npm install --omit=dev && npm cache clean --force

FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json server.js ./
USER node
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
CMD wget -qO- http://127.0.0.1:3001/health || exit 1
CMD ["node", "server.js"]
