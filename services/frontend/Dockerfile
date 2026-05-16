FROM node:24-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN apk update && \
    apk upgrade --no-cache
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
