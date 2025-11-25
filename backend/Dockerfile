FROM node:18-alpine

# set working directory
WORKDIR /app

# copy package manifests
COPY package*.json ./

# install dependencies
# RUN npm ci --only=production

# copy app source
COPY . .

# ensure uploads folder exists
RUN mkdir -p /app/uploads

EXPOSE 5001

# start the server
CMD ["node", "server.js"]
