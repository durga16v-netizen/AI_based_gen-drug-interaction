# GeneRx Frontend - React + Vite Dockerfile
# Stage 1: Build the React SPA
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors for optimal layer caching
COPY package*.json ./
RUN npm ci || npm install

# Copy source files and build production distribution
COPY . .
RUN npm run build

# Stage 2: Production Web Server with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration with reverse proxy for /api
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose web server port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

