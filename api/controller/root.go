package controller

import (
	"fmt"
	"net/http"
)

func Root(w http.ResponseWriter, r *http.Request) {
	const routes = "/filter/tree\n" +
				   "/filter/{studijskiProgram}/{studijskaGrupa}/{semestar}/{predmet}\n" +
				   "/casovi?[predmet, vrstaNastave, semestar, studijskaGrupa, studijskiProgram, vremeOdPre, " +
				   "vremeOdPosle,vremeDoPre, vremeDoPosle, grupa]+"
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w,"API v0.2")
	fmt.Fprintln(w, routes)
}