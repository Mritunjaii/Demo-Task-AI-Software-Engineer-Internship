# Multi-stage Dockerfile for Node.js + Prisma app
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package manifests and install all dependencies (including prisma)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app source and generate Prisma client
COPY . .
RUN npx prisma generate

# Remove dev files to keep image small
RUN npm prune --production

## Production image
FROM node:20-bullseye-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy only production node_modules and built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

EXPOSE 3000

# Use a non-root user for better security (optional)
RUN useradd --user-group --create-home --shell /bin/false appuser && chown -R appuser:appuser /app
USER appuser

CMD ["node", "src/index.js"]
