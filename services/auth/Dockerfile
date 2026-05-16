FROM node:18.20.8-alpine3.21
RUN apk update && \
    apk upgrade --no-cache libssl3 libcrypto3
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --chown=node:node . .
USER node
EXPOSE 5001
CMD ["node", "server.js"]
