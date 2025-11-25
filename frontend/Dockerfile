### build stage
FROM node:18-alpine AS build
WORKDIR /app

# install deps
COPY package*.json ./
RUN npm ci

# copy sources and build
COPY . .
RUN npm run build

### production stage
FROM nginx:stable-alpine

# copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
