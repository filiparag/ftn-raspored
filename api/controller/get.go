package controller

import (
	"encoding/json"
	"github.com/filiparag/ftn-raspored/api/database"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

func GetStudyPrograms(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	response := database.GetStudyPrograms()
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Println(err)
		return
	}
}

func GetStudyGroups(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	studijskiProgram, err := strconv.Atoi(vars["studijskiProgram"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	response := database.GetStudyGroups(studijskiProgram)
	if len(response) == 0 {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func GetSemesters(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	studijskaGrupa, err := strconv.Atoi(vars["studijskaGrupa"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	response := database.GetSemesters(studijskaGrupa)
	if len(response) == 0 {
		w.WriteHeader(http.StatusNoContent)
	} else {
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func GetSubjects(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	semestar, err := strconv.Atoi(vars["semestar"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	response := database.GetSubjects(semestar)
	if len(response) == 0 {
		w.WriteHeader(http.StatusNoContent)
	} else {
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func GetTypes(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	predmet, err := strconv.Atoi(vars["predmet"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	response := database.GetTypes(predmet)
	if len(response) == 0 {
		w.WriteHeader(http.StatusNoContent)
	} else {
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	}
}