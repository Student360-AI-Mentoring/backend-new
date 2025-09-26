# Build stage
FROM node:22.19.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies needed for building
RUN npm ci && npm cache clean --force

# Copy source code
COPY src ./src

# Build application
RUN npm run build

# Production stage
FROM node:22.19.0-alpine AS production

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache dumb-init bash

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package and config files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Reuse dependencies from builder stage (includes dev deps for CLI tooling)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy source (needed for TypeORM CLI and seeds) and built application
COPY --from=builder --chown=nestjs:nodejs /app/src ./src
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy entrypoint and helper scripts
COPY --chown=nestjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
COPY --chown=nestjs:nodejs wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./docker-entrypoint.sh ./wait-for-it.sh

# Set production environment after dependencies are in place
ENV NODE_ENV=production

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Start application with migration & seed hook
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
