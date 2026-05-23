# ---------- Builder ----------
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 git ca-certificates openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy prisma first
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy remaining source code
COPY . .

# Remove dev dependencies
RUN npm prune --production

# ---------- Production ----------
FROM node:20-bullseye-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

RUN useradd --user-group --create-home --shell /bin/false appuser && \
    chown -R appuser:appuser /app

USER appuser

CMD ["node", "src/index.js"]