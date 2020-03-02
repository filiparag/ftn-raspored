package controller

import (
	"encoding/json"
	"github.com/filiparag/ftn-raspored/api/database"
	"github.com/filiparag/ftn-raspored/api/model"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

func GetCTree(w http.ResponseWriter, r *http.Request) {
	tree := make(model.CFilterTree, 0)
	for _, sp := range database.GetStudyPrograms() {
		cSP := model.CFilterStudijskiProgram {
			StudyProgram: sp,
			StudyGroups:  make([]model.CFilterStudijskaGrupa, 0),
		}
		for _, sg := range database.GetStudyGroups(sp.Id) {
			cSG := model.CFilterStudijskaGrupa {
				StudyGroup: sg,
				Semesters:  make([]model.CFilterSemestar, 0),
			}
			for _, sm := range database.GetSemesters(sg.Id) {
				cSM := model.CFilterSemestar {
					Semester: sm,
					Subjects:  make([]model.CFilterPredmet, 0),
				}
				for _, pr := range database.GetSubjects(sm.Id) {
					cPR := model.CFilterPredmet {
						Subject: pr,
						Groups: database.GetGroups(pr.Id),
						Types: database.GetTypes(pr.Id),
						Lecturers: database.GetLecturers(pr.Id),
					}
					cSM.Subjects = append(cSM.Subjects, cPR)
				}
				cSG.Semesters = append(cSG.Semesters, cSM)
			}
			cSP.StudyGroups = append(cSP.StudyGroups, cSG)
		}
		tree = append(tree, cSP)
	}
	if len(tree) == 0 {
		w.WriteHeader(http.StatusNoContent)
	} else {
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(tree)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func GetCSubject(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	predmet, err := strconv.Atoi(vars["predmet"])
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err)
		return
	}
	response := model.CFilterPredmet{
		Types:  database.GetTypes(predmet),
		Groups: database.GetGroups(predmet),
		Lecturers: database.GetLecturers(predmet),
	}
	if len(response.Types) == 0 || len(response.Groups) == 0 {
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
