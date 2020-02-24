package model

type StudijskiProgram struct {
	Id			int	`json:"id"`
	Name 		string `json:"studijski_program"`
}

type StudijskaGrupa struct {
	Id			int				`json:"id"`
	Name 		string 			`json:"studijska_grupa"`
	ParentID	int 			`json:"studijski_program_id"`
}

type Semestar struct {
	Id			int				`json:"id"`
	Name 		string 			`json:"semestar"`
	ParentID	int 			`json:"studijska_grupa_id"`
}

type Predmet struct {
	Id			int				`json:"id"`
	Name 		string 			`json:"predmet"`
	ParentID	int 			`json:"semestar_id"`
}

type VrstaNastave struct {
	Id			int				`json:"id"`
	Name 		string 			`json:"vrsta_nastave"`
}

type Cas struct {
	Id			int				`json:"id"`
	Parent		int 			`json:"predmet_id"`
	Type		VrstaNastave 	`json:"vrsta_nastave"`
}