FROM node:24-alpine
RUN apk update && \
    apk upgrade --no-cache libssl3 libcrypto3
RUN npm install -g npm@11.14.1 && npm cache clean --force
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node . .
USER node
EXPOSE 5001
CMD ["node", "server.js"]
