# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

# Build stage
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Copy only package.json and package-lock.json first for layer caching
COPY --link package.json package-lock.json ./

# Install dependencies (use npm ci for deterministic builds)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application source
COPY --link . .

# Build the frontend (assumes Vite or similar build tool)
RUN npm run build

# Remove dev dependencies to minimize final image size
RUN rm -rf node_modules && npm ci --production

# Production stage
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN useradd -m appuser

# Copy built assets and production dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/nginx.conf ./nginx.conf
COPY --from=builder /app/index.html ./index.html

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Use a minimal web server to serve static files (e.g., serve or nginx)
# Here, we'll use 'serve' npm package for simplicity
# Install as root, then switch to non-root user
RUN npm install -g serve

USER appuser

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
