FROM node:14-alpine

#RUN npm install -g pm2

WORKDIR /app

COPY ./package.json ./

RUN npm i

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]
