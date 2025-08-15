# =====================
# 1. Build stage
# =====================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (better caching for dependencies)
COPY package*.json ./

# Install ALL dependencies (including devDependencies) for build
RUN npm install

# Copy rest of the project
COPY . .

# Build the Next.js app
RUN npm run build

# =====================
# 2. Production stage
# =====================
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set NODE_ENV for production
ENV NODE_ENV=production

# Copy only required files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Next.js standalone output (optional, if using output=standalone in next.config.js)
# COPY --from=builder /app/standalone ./ 

# Expose app port
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "start"]
