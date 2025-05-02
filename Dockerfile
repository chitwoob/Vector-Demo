# Use Node 20 slim as the base image
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Install dependencies (including devDependencies for prisma generate)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code (including prisma directory)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=base /app .
RUN npm run build

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package.json for production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the entire Prisma-related directories from the builder stage
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built assets and necessary files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
