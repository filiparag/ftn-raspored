import { Dispatch } from "redux"

export interface DropdownEntry {
	key: number | string,
	text: string,
	value: number | string
}

export interface UIState {
	get: {
		studyPrograms: DropdownEntry[],
		studyGroups: DropdownEntry[],
		semesters: DropdownEntry[],
		subjects: DropdownEntry[],
		groups: DropdownEntry[],
		types: DropdownEntry[],
		lecturers: DropdownEntry[],
		classrooms: DropdownEntry[],
		days: DropdownEntry[]
	},
	set: {
		spSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		sgSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		smSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		suSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		grSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		tySet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		leSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		clSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>,
		daSet: React.Dispatch<React.SetStateAction<DropdownEntry[]>>
	},
	dispatch: Dispatch<any>
}

export type Section = '/' | 'sp' | 'sg' | 'sm' | 'su' | 'ty' | 'gr' | 'le' | 'cl' | 'da'

export interface DispatchUIPayload {
	section: Section
	values: Array<number | string>,
	string: string
}

export const dayStrings = [
	'Ponedeljak', 'Utorak', 'Sreda', 
	'Četvrtak', 'Petak', 'Subota', 'Nedelja']