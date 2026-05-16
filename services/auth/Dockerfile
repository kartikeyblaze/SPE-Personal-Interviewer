FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --chown=node:node . .
USER node
EXPOSE 5001
CMD ["node", "server.js"]
