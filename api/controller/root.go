package controller

import (
	"fmt"
	"net/http"
)

func Root(w http.ResponseWriter, r *http.Request) {

	const routes = "/filter/{studijskiProgram}/{studijskaGrupa}/{semestar}/{predmet}/{vrstaNastave}\n" +
				   "/classes?[predmet, vrstaNastave, semestar, studijskaGrupa, studijskiProgram, vremeOdPre, vremeOdPosle, vremeDoPre, vremeDoPosle, grupa]+"

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w,"API v0.1")
	fmt.Fprintln(w,routes)
}