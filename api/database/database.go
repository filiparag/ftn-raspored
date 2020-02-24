package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

var db sql.DB

func Open() {
	conn, err := sql.Open("sqlite3", "/home/filiparag/.syncthing/documents/Faculty/raspored/baza/raspored.db")
	if err != nil {
		log.Fatal(err)
	}
	db = *conn
}

func Close() {
	db.Close()
}