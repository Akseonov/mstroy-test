# Собираем статику с react-приложений
FROM node:22-alpine AS vue
ARG APP_ENV

WORKDIR /app
COPY . /app
RUN CI=1 npm i && npm run build

FROM nginx:stable
WORKDIR /app
COPY ./deploy/nginx/conf.d /etc/nginx/templates
COPY ./deploy/nginx/includes /etc/nginx/includes
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=vue /app/dist /app
