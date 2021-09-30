FROM node:14

WORKDIR /app

COPY ./package.json ./

RUN apt-get update && apt-get install -y postgresql-client

RUN npm i

COPY . .

RUN npm run build

CMD [ "npm", "run", "pm2" ]
