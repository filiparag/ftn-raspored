FROM golang:1.21.1

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/bin ./...

ENTRYPOINT ["/usr/bin/api", "/var/db/raspored.db"]

EXPOSE 10000/tcp
