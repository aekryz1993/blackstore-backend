docker-compose stop
#docker-compose down --rmi all --volumes
#docker rmi $(docker images -a -q) -f
docker image prune -f
docker images
docker-compose up --scale bluestore=4 --build -d
docker-compose logs --follow
