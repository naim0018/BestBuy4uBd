# -------------------------------------------------------------------
# STAGE 1: Build React + Vite app & run postbuild.js
# -------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------------------------------------------
# STAGE 2: Lightweight Nginx + PHP-FPM Runtime (~50MB)
# -------------------------------------------------------------------
FROM trafex/php-nginx:latest AS runner

# Copy compiled files (including dist/index.php and static assets)
COPY --from=builder /app/dist /var/www/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080