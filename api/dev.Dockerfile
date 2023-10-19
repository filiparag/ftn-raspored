FROM golang:1.21.1

COPY . /usr/src/app
WORKDIR /usr/src/app

COPY go.mod ./
COPY go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN ["go", "get", "github.com/githubnemo/CompileDaemon"]
RUN ["go", "install", "github.com/githubnemo/CompileDaemon"]

ENTRYPOINT CompileDaemon -polling -log-prefix=false -build="go build -v -o /usr/bin ./..." -command="/usr/bin/api /var/db/raspored.db" -directory="./"

EXPOSE 10000/tcp
