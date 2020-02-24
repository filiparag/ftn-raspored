package controller

import (
	"fmt"
	"net/http"
)
func Root(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Hello, I am home controller!")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Hello, I am home controller!")
}