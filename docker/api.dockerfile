FROM alpine:latest

ENTRYPOINT ["/usr/bin/server", "/var/db/database.db"]

EXPOSE 10000/tcp