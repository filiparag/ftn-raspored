package middleware

import (
	"fmt"
	"net/http"
	"time"
)

func Middleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		now := time.Now().Format("[2006-01-02T15:04:05] ")
		fmt.Print(now)
		fmt.Println(r.URL)
		handler.ServeHTTP(w, r)
	})
}
