package route

import (
	"github.com/gorilla/mux"
	"raspored/controller"
)

func Router() *mux.Router {
	routes := mux.NewRouter().StrictSlash(true).PathPrefix("/api/v0.1/").Subrouter()

	routes.HandleFunc("/", controller.Root).Methods("GET")

	routes.HandleFunc("/classes", controller.Classes).Methods("GET")

	routes.HandleFunc("/filter", controller.GetStudyPrograms).Methods("GET")
	routes.HandleFunc("/filter/{studijskiProgram}", controller.GetStudyGroups).Methods("GET")
	routes.HandleFunc("/filter/{studijskiProgram}/{studijskaGrupa}", controller.GetSemesters).Methods("GET")
	routes.HandleFunc("/filter/{studijskiProgram}/{studijskaGrupa}/{semestar}", controller.GetSubjects).Methods("GET")
	routes.HandleFunc("/filter/{studijskiProgram}/{studijskaGrupa}/{semestar}/{predmet}", controller.GetTypes).Methods("GET")
	routes.HandleFunc("/filter/{studijskiProgram}/{studijskaGrupa}/{semestar}/{predmet}/{vrstaNastave}", controller.GetTypes).Methods("GET")

	return routes;
}
