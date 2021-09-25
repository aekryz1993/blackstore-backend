FROM nginx

# ARG PORT

# RUN echo $PORT

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY ./blackstoregb_com* /etc/nginx/

# RUN nginx -T

# CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
