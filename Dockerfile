FROM node:14-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm i

COPY . .

RUN npm install -g @socket.io/pm2

RUN npm run build

CMD [ "npm", "run", "pm2" ]
