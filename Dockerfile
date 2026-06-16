# ── Stage 1 : builder ───────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copie les manifestes EN PREMIER → layer mis en cache
COPY package*.json ./
RUN npm ci

# Copie le code source EN DERNIER → invalidé à chaque modif
COPY . .

# ── Stage 2 : production (image légère) ─────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Seulement les dépendances de prod
COPY package*.json ./
RUN npm ci --only=production

# Copie le code depuis le stage builder
COPY --from=builder /app/src ./src

# Sécurité : ne pas tourner en root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
