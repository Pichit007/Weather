FROM oven/bun AS frontend

WORKDIR /app/frontend

COPY weather-moodeng/ .

RUN bun install

RUN bun run build

FROM oven/bun AS backend

WORKDIR /app

COPY backend/ .

RUN bun install --production

COPY --from=frontend /app/frontend/dist ./public

EXPOSE 3001

CMD ["bun", "server.js"]