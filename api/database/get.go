package database

import (
	"github.com/filiparag/ftn-raspored/api/model"
	"log"
)

func GetStudyPrograms() []model.StudijskiProgram {

	rows, err := db.Query("SELECT id, studijski_program FROM studijski_program")
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	response := make([]model.StudijskiProgram, 0)

	for rows.Next() {
		var row model.StudijskiProgram
		err = rows.Scan(&row.Id, &row.Name)
		if err != nil {
			log.Println(err)
		}
		response = append(response, row)
	}

	return response
}

func GetStudyGroups(studyProgram int) []model.StudijskaGrupa {

	rows, err := db.Query("SELECT id, studijska_grupa FROM studijska_grupa WHERE studijski_program_id = ?", studyProgram)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	response := make([]model.StudijskaGrupa, 0)

	for rows.Next() {
		var row model.StudijskaGrupa
		err = rows.Scan(&row.Id, &row.Name)
		if err != nil {
			log.Println(err)
			return nil
		}
		response = append(response, row)
	}

	return response
}

func GetSemesters(studyGroup int) []model.Semestar {

	rows, err := db.Query("SELECT id, semestar FROM semestar WHERE studijska_grupa_id = ?", studyGroup)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	response := make([]model.Semestar, 0)

	for rows.Next() {
		var row model.Semestar
		err = rows.Scan(&row.Id, &row.Number)
		if err != nil {
			log.Println(err)
			return nil
		}
		response = append(response, row)
	}

	return response
}

func GetSubjects(semester int) []model.Predmet {

	rows, err := db.Query("SELECT id, predmet FROM predmet WHERE semestar_id = ?", semester)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	response := make([]model.Predmet, 0)

	for rows.Next() {
		var row model.Predmet
		err = rows.Scan(&row.Id, &row.Name)
		if err != nil {
			log.Println(err)
			return nil
		}
		response = append(response, row)
	}

	return response
}

func GetTypes(subject int) []model.VrstaNastave {

	rows, err := db.Query(`SELECT DISTINCT vn.id, vn.vrsta_nastave
								 FROM cas AS c
								 INNER JOIN vrsta_nastave vn on c.vrsta_nastave_id = vn.id
								 INNER JOIN predmet p on c.predmet_id = p.id
								 WHERE p.id = ?`, subject)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	response := make([]model.VrstaNastave, 0)

	for rows.Next() {
		var row model.VrstaNastave
		err = rows.Scan(&row.Id, &row.Name)
		if err != nil {
			log.Println(err)
			return nil
		}
		response = append(response, row)
	}

	return response
}

func GetGroups(subject int) []model.Grupa {

	rows, err := db.Query(`SELECT DISTINCT c.grupa
								 FROM cas AS c
								 INNER JOIN predmet p on c.predmet_id = p.id
								 WHERE p.id = ?`, subject)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer rows.Close()

	response := make([]model.Grupa, 0)

	for rows.Next() {
		var row model.Grupa
		err = rows.Scan(&row)
		if err != nil {
			log.Println(err)
			return nil
		}
		response = append(response, row)
	}

	return response
}

func GetClasses(query string, args []string) []model.Cas {

	stmt, err := db.Prepare(query)
	if err != nil {
		log.Println(err)
		return nil
	}

	argsInterface := make([]interface{}, len(args))
	for in, val := range args {
		argsInterface[in] = val
	}

	rows, err := stmt.Query(argsInterface...)
	if err != nil {
		log.Println(err)
		return nil
	}
	defer stmt.Close()

	response := make([]model.Cas, 0)

	for rows.Next() {
		var row model.Cas
		err = rows.Scan(&row.Id, &row.Subject, &row.Type, &row.Group, &row.Day,
			&row.TimeStart, &row.TimeEnd, &row.Classroom, &row.Lecturer)
		if err != nil {
			log.Println(err)
			return nil
		}
		response = append(response, row)
	}

	return response
}