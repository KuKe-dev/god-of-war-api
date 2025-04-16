ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 5173

CMD ["npm", "start"]
