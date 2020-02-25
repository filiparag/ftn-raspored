package middleware

import (
	"fmt"
	"net/http"
)

func Middleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.URL)
		handler.ServeHTTP(w, r)
	})
}