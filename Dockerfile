FROM oven/bun AS frontend

WORKDIR /app/frontend

COPY check-weather/package.json ./

RUN bun install

COPY check-weather/ .

RUN bun run build

FROM oven/bun AS backend

WORKDIR /app

COPY backend/package.json ./

RUN bun install --production

COPY backend/ .

COPY --from=frontend /app/frontend/build ./public

EXPOSE 3000

CMD ["bun", "server.js"]