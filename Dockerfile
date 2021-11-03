FROM node:14-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm i

COPY . .

RUN npm run db:migrations-down

RUN npm run db:migrations

RUN npm run build

CMD [ "npm", "run", "start" ]
