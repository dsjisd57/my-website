FROM node:20-alpine

WORKDIR /app

ARG VITE_BASE_URL=/
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package*.json ./
RUN npm ci

COPY vite.config.ts tsconfig*.json ./
COPY index.html ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

COPY server/package*.json ./server/
RUN cd server && npm ci

COPY server/tsconfig.json ./server/
COPY server/src/ ./server/src/
RUN cd server && npm run build

ENV STATIC_PATH=/

EXPOSE 3001

CMD ["node", "server/dist/index.js"]
