# run postgres docker
docker run -d -p 5432:5432 \
    --name postgres \
    -e POSTGRES_PASSWORD=123 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=postgres \
    -v db_data:/var/lib/postgresql/data \
    postgres:latest
