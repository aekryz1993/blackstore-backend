docker-compose stop
docker-compose down --rmi all --volumes
docker rmi $(docker images -a -q) -f
