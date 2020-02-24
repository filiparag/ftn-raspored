package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
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