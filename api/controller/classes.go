package controller

import (
	"crypto"
	"encoding/base32"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"
	"time"

	ics "github.com/arran4/golang-ical"
	"github.com/filiparag/ftn-raspored/api/database"
	"github.com/filiparag/ftn-raspored/api/model"
)

func Classes(w http.ResponseWriter, r *http.Request) {

	if len(r.URL.Query()) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

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
	keywords["dan"] = [2]string{"c.dan", "="}
	keywords["izvodjac"] = [2]string{"c.izvodjac", "="}
	keywords["ucionica"] = [2]string{"c.ucionica", "="}

	var sqlQuery = `SELECT c.id, p.predmet, vn.vrsta_nastave, c.grupa, c.dan,
						   c.vreme_od, c.vreme_do, c.ucionica, c.izvodjac
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
			if whereAnd {
				sqlQuery += "AND "
			}
			whereAnd = true
			sqlQuery += "("
			var whereOr = false
			for v := range val {
				var value = val[v]
				if !whereOr {
					whereOr = true
				} else {
					sqlQuery += " OR "
				}
				if key == "izvodjac" {
					sqlQuery += fmt.Sprintf("%s LIKE ? COLLATE NOCASE", ident[0])
					sqlArgs = append(sqlArgs, "%"+value+"%")
				} else {
					sqlQuery += fmt.Sprintf("%s %s ?", ident[0], ident[1])
					sqlArgs = append(sqlArgs, value)
				}
			}
			sqlQuery += ")"
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
		if r.URL.Path == "/casovi" {
			err := json.NewEncoder(w).Encode(response)
			if err != nil {
				log.Println(err)
				return
			}
		} else if r.URL.Path == "/ical" {
			id := base32.StdEncoding.EncodeToString(crypto.SHA1.New().Sum([]byte(r.URL.RawQuery)))
			fileName := fmt.Sprintf("attachment; filename=ftn_raspored_%s.ics", id[:16])
			w.Header().Add("Content-Type", "text/calendar; charset=utf-8")
			w.Header().Set("Content-Disposition", fileName)
			fmt.Fprintln(w, calendar(response))
		}
	}

}

func calendar(classes []model.Cas) string {

	tz, _ := time.LoadLocation("Europe/Belgrade")
	newYear := time.Date(time.Now().Year(), 10, 1, 0, 0, 0, 0, time.UTC)
	startDay := int(newYear.Weekday()+6) % 7

	cal := ics.NewCalendar()
	cal.SetName("FTN Raspored")
	cal.SetTimezoneId("Europe/Belgrade")
	cal.SetTzid("Europe/Belgrade")
	cal.SetRefreshInterval("PT24H")
	cal.SetColor("slategray")
	cal.SetMethod(ics.MethodRequest)

	for _, c := range classes {

		startTime := time.Date(
			newYear.Year(),
			newYear.Month(),
			(c.Day+1)+(7-startDay),
			int(math.Floor(float64(c.TimeStart))),
			int(math.Mod(float64(c.TimeStart*100), 100)*0.6),
			0, 0, tz,
		)
		endTime := time.Date(
			newYear.Year(),
			newYear.Month(),
			(c.Day+1)+(7-startDay),
			int(math.Floor(float64(c.TimeEnd))),
			int(math.Mod(float64(c.TimeEnd*100), 100)*0.6),
			0, 0, tz,
		)

		event := cal.AddEvent(strconv.Itoa(c.Id))
		event.SetDtStampTime(startTime)
		event.SetStartAt(startTime)
		event.SetEndAt(endTime)
		event.SetSummary(c.Subject)
		event.SetLocation(c.Classroom)
		event.SetOrganizer(c.Lecturer)
		switch c.Type {
		case "Pred.":
			event.SetColor("dodgerblue")
			event.SetDescription("Predavanje")
		case "rač.vežbe":
			event.SetColor("limegreen")
			event.SetDescription("Računarske vežbe")
		case "aud.vežbe":
			event.SetColor("darkorange")
			event.SetDescription("Auditorne vežbe")
		case "lab.vežbe":
			event.SetColor("firebrick")
			event.SetDescription("Laboratorijske vežbe")
		case "arh.vežbe":
			event.SetColor("saddlebrown")
			event.SetDescription("Arhitekturne vežbe")
		case "um.vežbe":
			event.SetColor("plum")
			event.SetDescription("Umetničke vežbe")
		}
		event.AddRrule("FREQ=WEEKLY;INTERVAL=1")
		// event.AddRrule("FREQ=WEEKLY;INTERVAL=1;UNTIL=20240218T000000Z")
		// event.AddExdate("20240101,20240102,20240108")

	}

	return cal.Serialize()

}
