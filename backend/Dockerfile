# Backend Dockerfile
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm ci
COPY src/ ./src/
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 && \
    chown -R backend:nodejs /app
USER backend
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
RUN npm ci --only=production
COPY src/ ./src/
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 && \
    chown -R backend:nodejs /app
USER backend
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
CMD ["npm", "start"]
