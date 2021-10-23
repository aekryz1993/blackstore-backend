docker-compose stop
#docker-compose down --rmi all
#docker rmi $(docker images -a -q) -f
#docker images
docker-compose up --build -d
docker-compose logs --follow
