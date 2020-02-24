package main

import (
	"log"
	"net/http"
	"raspored/database"
	"raspored/route"
)

func main() {

	db := database.Open()
	defer database.Close(db)

	router := route.Router()
	http.Handle("/", router)
	log.Fatal(http.ListenAndServe(":10000", nil))

}