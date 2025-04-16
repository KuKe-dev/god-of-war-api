ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

RUN apk update && apk add git

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 1234

CMD [ "npm", "start" ]

