# Stage 1: Build React/Vite app with pnpm
FROM node:20-alpine AS build

WORKDIR /app

# Habilitar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias y compilar
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install

COPY . .
RUN pnpm build

# Stage 2: Serve con Nginx Alpine (ligero, <25MB)
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
