FROM node:14

WORKDIR /app

COPY ./package.json ./

RUN apt-get update && apt-get install -y postgresql-client

RUN npm i

COPY . .

# RUN chown -R app /opt/app

# USER app

# EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "pm2" ]
# CMD [ "npm", "start" ]
