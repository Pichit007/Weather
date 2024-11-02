FROM oven/bun AS frontend

WORKDIR /app/frontend

COPY weather-moodeng/package.json ./

RUN bun install

COPY weather-moodeng/ .

RUN bun run build

FROM oven/bun AS backend

WORKDIR /app

COPY backend/package.json ./

RUN bun install --production

COPY backend/ .

COPY --from=frontend /app/frontend/build ./public

EXPOSE 3000

CMD ["bun", "server.js"]