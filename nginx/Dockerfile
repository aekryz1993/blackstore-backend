FROM nginx:alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY ./blackstoregb_com* /etc/nginx/

CMD [ "nginx", "-g", "daemon off;" ]
