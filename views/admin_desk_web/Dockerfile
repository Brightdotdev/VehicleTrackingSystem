# 1. Base image with Node
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY package*.json ./
RUN npm install

# 4. Copy rest of project
COPY . .

# 5. Build Next.js app
RUN npm run build

# 6. Start Next.js app
CMD ["npm", "run", "start"]

# Expose port
EXPOSE 3000
