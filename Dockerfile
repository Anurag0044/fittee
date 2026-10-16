# ==============================================================================
# FITTEE E-Commerce Backend: Multi-Stage Production Dockerfile
# Optimized for Google Cloud Run, AWS App Runner & Docker Deployments
# ==============================================================================

# Stage 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with lockfile integrity
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generate Prisma Client types
RUN npx prisma generate

# Copy compiler config and source code
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript to dist/
RUN npm run build

# Remove development dependencies for minimal image footprint
RUN npm prune --omit=dev

# Stage 2: Production Runtime Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Security hardening: Run as non-root system user
USER node

# Copy compiled files, production dependencies, and prisma artifacts
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 8000

# Container health probe
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8000/health || exit 1

# Start production server
CMD ["node", "dist/server.js"]
