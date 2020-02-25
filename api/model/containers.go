package model

type CFilterPredmet struct {
	VrstaNastave	[]VrstaNastave 	`json:"vrsta_nastave"`
	Grupa			[]Grupa			`json:"grupa"`
}