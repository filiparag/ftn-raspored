package model

type CFilterTree []CFilterStudijskiProgram

type CFilterStudijskiProgram struct {
	StudyProgram	StudijskiProgram		`json:"studijski_program"`
	StudyGroups		[]CFilterStudijskaGrupa	`json:"studijska_grupa"`
}

type CFilterStudijskaGrupa struct {
	StudyGroup		StudijskaGrupa		`json:"studijska_grupa"`
	Semesters		[]CFilterSemestar	`json:"semestar"`
}

type CFilterSemestar struct {
	Semester		Semestar			`json:"semestar"`
	Subjects		[]CFilterPredmet	`json:"predmet"`
}

type CFilterPredmet struct {
	Subject			Predmet			`json:"semestar"`
	Types			[]VrstaNastave	`json:"vrsta_nastave"`
	Groups 			[]Grupa        	`json:"grupa"`
}

type CFilterVrstaNastaveGrupa struct {
	Types  			[]VrstaNastave 		`json:"vrsta_nastave"`
	Groups 			[]Grupa        		`json:"grupa"`
}