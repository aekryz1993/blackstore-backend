FROM node:14

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN adduser app

COPY . .

RUN npm install

RUN chown -R app /opt/app

USER app

# EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "pm2" ]
# CMD [ "npm", "start" ]