FROM node:18-alpine

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm ci

# copy sources and build
COPY . .
RUN npm run build
