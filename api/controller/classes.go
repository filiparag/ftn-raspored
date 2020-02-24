package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"raspored/database"
)

func Classes(w http.ResponseWriter, r *http.Request) {

	keywords := make(map[string]string)
	keywords["predmet"] = "p.id ="
	keywords["vrstaNastave"] = "vn.id ="
	keywords["semestar"] = "s.id ="
	keywords["studijskaGrupa"] = "sg.id ="
	keywords["studijskiProgram"] = "sp.id ="
	keywords["vremeOdPre"] = "c.vreme_od <="
	keywords["vremeOdPosle"] = "c.vreme_od >="
	keywords["vremeDoPre"] = "c.vreme_do <="
	keywords["vremeDoPosle"] = "c.vreme_do >="
	keywords["grupa"] = "c.grupa = "

	var sqlQuery = `SELECT c.id, p.predmet, vn.vrsta_nastave, c.grupa, c.dan,
						   c.vreme_od, c.vreme_do, c.ucionica, c.izvodjaci
					FROM cas AS c
					INNER JOIN vrsta_nastave vn on c.vrsta_nastave_id = vn.id
					INNER JOIN predmet p on c.predmet_id = p.id
					INNER JOIN semestar s on p.semestar_id = s.id
					INNER JOIN studijska_grupa sg on s.studijska_grupa_id = sg.id
					INNER JOIN studijski_program sp on sg.studijski_program_id = sp.id`

	var whereAnd = false
	for key, val := range r.URL.Query() {
		if len(val) == 0 {
			w.WriteHeader(http.StatusNotAcceptable)
			return
		}
		if ident, ok := keywords[key]; ok {
			var whereOr = false
			for v := range val {
				var value = val[v]
				if key == "grupa" {
					value = fmt.Sprintf("'%s'", value)
				}
				if !whereAnd {
					sqlQuery += fmt.Sprintf(" WHERE %s %s", ident, value)
					whereAnd = true
					whereOr = true
				} else if !whereOr {
					sqlQuery += fmt.Sprintf(" AND %s %s", ident, value)
					whereOr = true
				} else {
					sqlQuery += fmt.Sprintf(" OR %s %s", ident, value)
				}
			}
		} else {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	response := database.GetClasses(sqlQuery)
	if len(response) == 0 {
		w.WriteHeader(http.StatusNoContent)
	} else {
		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
		}
	}

}