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

func localTimestamp(ts time.Time) string {
	return ts.Format("20060102T150405")
}

func combineDatetimes(ts time.Time, dates []string) string {
	rule := ""
	for _, d := range dates {
		rule += fmt.Sprintf("%sT%s,", d, ts.Format("150405"))
	}
	return rule
}

func combineDates(ts time.Time, dates []string) string {
	rule := ""
	for _, d := range dates {
		rule += fmt.Sprintf("%s,", d)
	}
	return rule
}

func calendar(classes []model.Cas) string {

	startMonth := time.Date(2024, 9, 30, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2025, 2, 16, 0, 0, 0, 0, time.UTC)
	startDay := int(startMonth.Weekday()+6) % 7
	tz, _ := time.LoadLocation("Europe/Belgrade")

	cal := ics.NewCalendar()
	cal.SetName("FTN Raspored")
	cal.SetTimezoneId("Europe/Belgrade")
	cal.SetTzid("Europe/Belgrade")
	cal.SetRefreshInterval("PT24H")
	cal.SetColor("slategray")
	cal.SetMethod(ics.MethodRequest)

	swapdays := [][]string{
		{"20250415"}, // Monday
		{},           // Tuesday
		{"20250103"}, // Wednesday
		{"20250416"}, // Thursday
		{"20250417"}, // Friday
		{},           // Saturday
		{},           // Sunday
	}

	exdates := []string{
		// Day swaps
		"20250103", "20250415", "20250416", "20250417",
		// Winter semester
		"20241111", "20241225", "20250101", "20250102", "20250118", "20250119",
		"20250120", "20250121", "20250122", "20250123", "20250124", "20250125",
		"20250126", "20250127", "20250128", "20250129", "20250130", "20250131",
		"20250201", "20250202", "20250203", "20250204", "20250205", "20250206",
		"20250207", "20250208", "20250209", "20250210", "20250211", "20250212",
		"20250213", "20250214", "20250215", "20250216",
		// Summer semester
		"20250217", "20250407", "20250408", "20250409", "20250410", "20250411",
		"20250412", "20250413", "20250418", "20250419", "20250420", "20250421",
		"20250501", "20250502", "20250609", "20250610", "20250611", "20250612",
		"20250613", "20250614", "20250615", "20250616", "20250617", "20250618",
		"20250619", "20250620", "20250621", "20250622", "20250623", "20250624",
		"20250625", "20250626", "20250627", "20250628", "20250629", "20250630",
		"20250701", "20250702", "20250703", "20250704", "20250705", "20250706",
		"20250707", "20250708", "20250709", "20250710", "20250711", "20250712",
		"20250713",
	}

	for _, c := range classes {

		year := startMonth.Year()
		month := startMonth.Month()
		day := (c.Day + 1) + (7 - startDay)
		startHour := int(math.Floor(float64(c.TimeStart)))
		startMinute := int(math.Mod(float64(c.TimeStart*100), 100) * 0.6)
		endHour := int(math.Floor(float64(c.TimeEnd)))
		endMinute := int(math.Mod(float64(c.TimeEnd*100), 100) * 0.6)

		if c.Day >= 7 {
			date := time.Unix(int64(c.Day), 0)
			year = date.Year()
			month = date.Month()
			day = date.Day()
		}

		startTime := time.Date(year, month, day, startHour, startMinute, 0, 0, tz)
		endTime := time.Date(year, month, day, endHour, endMinute, 0, 0, tz)

		event := cal.AddEvent(strconv.Itoa(c.Id))
		event.SetProperty(ics.ComponentPropertyDtstamp, localTimestamp(startTime))
		event.SetProperty(ics.ComponentPropertyDtStart, localTimestamp(startTime))
		event.SetProperty(ics.ComponentPropertyDtEnd, localTimestamp(endTime))
		event.SetSummary(c.Subject)
		event.SetLocation(c.Classroom)
		event.SetOrganizer(c.Lecturer)
		event.SetTimeTransparency(ics.TransparencyTransparent)
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
		if c.Day < 7 {
			event.AddRrule(fmt.Sprintf(
				"FREQ=WEEKLY;INTERVAL=1;UNTIL=%s",
				endDate.Format("20060102T150405Z"),
			))
			event.AddExdate(combineDatetimes(startTime, exdates))
			if len(swapdays[c.Day]) > 0 {
				event.AddProperty("RDATE;VALUE=DATE", combineDates(startTime, swapdays[c.Day]))
			}
		}

	}

	return cal.Serialize()

}
