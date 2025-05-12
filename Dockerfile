# Этап 1 — сборка проекта
FROM node:20-alpine AS build

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем
COPY . .
RUN npm run build

# Этап 2 — продакшен-образ
FROM nginx:alpine

# Копируем собранный проект в корень nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный nginx конфиг (опционально)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Порт 80 для доступа
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
