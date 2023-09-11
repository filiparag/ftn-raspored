package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var db sql.DB

func Open(database string) {
	conn, err := sql.Open("sqlite3", database)
	if err != nil {
		log.Fatal(err)
	}
	db = *conn
}

func Close() {
	err := db.Close()
	if err != nil {
		log.Fatal(err)
	}
}
