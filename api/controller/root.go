package controller

import (
	"fmt"
	"net/http"
)

func Root(w http.ResponseWriter, r *http.Request) {
	const routes = "/filter/tree\n" +
		"/filter/{studijskiProgram}/{studijskaGrupa}/{semestar}/{predmet}\n" +
		"/casovi?[predmet, vrstaNastave, semestar, studijskaGrupa, studijskiProgram, vremeOdPre, " +
		"vremeOdPosle,vremeDoPre, vremeDoPosle, grupa, dan, izvodjac]+\n" +
		"/ical?[predmet, vrstaNastave, semestar, studijskaGrupa, studijskiProgram, vremeOdPre, " +
		"vremeOdPosle,vremeDoPre, vremeDoPosle, grupa, dan, izvodjac]+\n" +
		"/version\n"
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "API endpoints:")
	fmt.Fprint(w, routes)
}

func Version(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "2023-10-20")
}
