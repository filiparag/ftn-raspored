package model

type StudijskiProgram struct {
	Id			int		`json:"id"`
	Name 		string 	`json:"studijski_program"`
}

type StudijskaGrupa struct {
	Id			int		`json:"id"`
	Name 		string 	`json:"studijska_grupa"`
}

type Semestar struct {
	Id			int		`json:"id"`
	Number 		int 	`json:"semestar"`
}

type Predmet struct {
	Id			int		`json:"id"`
	Name 		string 	`json:"predmet"`
}

type VrstaNastave struct {
	Id			int		`json:"id"`
	Name 		string 	`json:"vrsta_nastave"`
}

type Grupa string

type Izvodjac string

type Ucionica string

type Cas struct {
	Id			int		`json:"id"`
	Subject		string	`json:"predmet"`
	Type		string 	`json:"vrsta_nastave"`
	Group		string	`json:"grupa"`
	Day			int		`json:"dan"`
	TimeStart	float32	`json:"vreme_od"`
	TimeEnd		float32	`json:"vreme_do"`
	Classroom	string	`json:"ucionica"`
	Lecturer	string	`json:"izvodjac"`
}