FROM alpine:latest

RUN apk update && apk add --no-cache git musl-dev gcc build-base go

ENV srcdir /root/go/src/github.com/filiparag/ftn-raspored/api

WORKDIR ${srcdir}

ENV CGO_ENABLED 1

RUN go get -d ./...
RUN go build -v ./...
RUN go install -v ./...

ENTRYPOINT ["/root/go/bin/api", "/var/db/raspored.db"]

EXPOSE 10000/tcp