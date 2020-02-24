package main

import (
	"log"
	"net/http"
	"raspored/database"
	"raspored/route"
)

func main() {

	database.Open()
	defer database.Close()

	router := route.Router()
	http.Handle("/", router)
	log.Fatal(http.ListenAndServe(":10000", nil))



}