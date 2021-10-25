docker-compose stop
docker image prune -f
docker images
# docker-compose up --scale bluestore=4 --build -d
docker-compose up --build -d
docker-compose logs --follow
