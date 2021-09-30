FROM node:14

WORKDIR /app

COPY ./package.json ./

RUN apt-get update && apt-get install -y postgresql-client

RUN npm i

COPY . .

COPY ./resources/static/assets/pictures/services/default.png /var/lib/resources/static/assets/pictures/services

COPY ./resources/static/assets/pictures/users/default.png /var/lib/resources/static/assets/pictures/users

RUN npm run build

CMD [ "npm", "run", "pm2" ]
