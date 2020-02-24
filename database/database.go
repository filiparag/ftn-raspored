package database

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

func Open() *sql.DB {
	db, err := sql.Open("sqlite3", "/home/filiparag/.syncthing/documents/Faculty/raspored/baza/raspored.db")
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func Close(db *sql.DB) {
	db.Close()
}