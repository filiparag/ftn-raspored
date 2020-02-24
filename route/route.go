package route

import (
	"github.com/gorilla/mux"
	"raspored/controller"
)

func Router() *mux.Router {
	routes := mux.NewRouter().StrictSlash(false)
	routes.HandleFunc("/", controller.Root).Methods("GET")
	return routes;
}
