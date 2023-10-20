package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/filiparag/ftn-raspored/api/database"
	"github.com/filiparag/ftn-raspored/api/middleware"
	"github.com/filiparag/ftn-raspored/api/route"
)

func main() {

	var dbPath = os.Getenv("GOPATH") + "/src/github.com/filiparag/ftn-raspored/backend/database/raspored.db"

	if len(os.Args) == 2 {
		dbPath = os.Args[1]
	}

	database.Open(dbPath)
	defer database.Close()

	router := route.Router()
	mRouter := middleware.Middleware(router)
	if os.Getenv("DEV") == "true" {
		mRouter = middleware.CorsHeaderMiddleware(mRouter)
	}
	http.Handle("/", mRouter)
	fmt.Println("Serving API on :10000")
	log.Fatal(http.ListenAndServe(":10000", nil))

}
