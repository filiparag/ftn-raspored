package main

import (
	"github.com/filiparag/ftn-raspored/api/database"
	"github.com/filiparag/ftn-raspored/api/route"
	"log"
	"net/http"
	"os"
)

func main() {

	database.Open(os.Getenv("GOPATH") + "/src/github.com/filiparag/ftn-raspored/backend/database/raspored.db")
	defer database.Close()

	router := route.Router()
	http.Handle("/", router)
	log.Fatal(http.ListenAndServe(":10000", nil))

}