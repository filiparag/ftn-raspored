package controller

import (
	"encoding/json"
	"fmt"
	"github.com/filiparag/ftn-raspored/api/database"
	"log"
	"net/http"
)

func Classes(w http.ResponseWriter, r *http.Request) {

	keywords := make(map[string][2]string)
	keywords["predmet"] = [2]string{"p.id", "="}
	keywords["vrstaNastave"] = [2]string{"vn.id", "="}
	keywords["semestar"] = [2]string{"s.id", "="}
	keywords["studijskaGrupa"] = [2]string{"sg.id", "="}
	keywords["studijskiProgram"] = [2]string{"sp.id", "="}
	keywords["vremeOdPre"] = [2]string{"c.vreme_od", "<="}
	keywords["vremeOdPosle"] = [2]string{"c.vreme_od", ">="}
	keywords["vremeDoPre"] = [2]string{"c.vreme_do", "<="}
	keywords["vremeDoPosle"] = [2]string{"c.vreme_do", ">="}
	keywords["grupa"] = [2]string{"c.grupa", "="}

	var sqlQuery = `SELECT c.id, p.predmet, vn.vrsta_nastave, c.grupa, c.dan,
						   c.vreme_od, c.vreme_do, c.ucionica, c.izvodjaci
					FROM cas AS c
					INNER JOIN vrsta_nastave vn on c.vrsta_nastave_id = vn.id
					INNER JOIN predmet p on c.predmet_id = p.id
					INNER JOIN semestar s on p.semestar_id = s.id
					INNER JOIN studijska_grupa sg on s.studijska_grupa_id = sg.id
					INNER JOIN studijski_program sp on sg.studijski_program_id = sp.id
					WHERE`
	var sqlArgs = make([]string, 0)
	var whereAnd = false
	for key, val := range r.URL.Query() {
		if len(val) == 0 {
			w.WriteHeader(http.StatusNotAcceptable)
			return
		}
		sqlQuery += " "
		if ident, ok := keywords[key]; ok {
			var whereOr = false
			for v := range val {
				var value = val[v]
				if len(val) > 1 && v == 0 {
					sqlQuery += "("
				}
				if !whereAnd {
					whereAnd = true
					whereOr = true
				} else if !whereOr {
					sqlQuery += "AND "
					whereOr = true
				} else {
					sqlQuery += " OR "
				}
				sqlQuery += fmt.Sprintf("%s %s ?", ident[0], ident[1])
				sqlArgs = append(sqlArgs, value)
				if len(val) > 1 && v == len(val) - 1 {
					sqlQuery += ")"
				}
			}
		} else {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	response := database.GetClasses(sqlQuery, sqlArgs)
	if response == nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	} else if len(response) == 0 {
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