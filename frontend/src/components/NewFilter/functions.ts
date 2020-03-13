import { DropdownEntry } from './data'

export const timeString = (time: number): string => {
	let hour = '0' + Math.floor(time)
	let minute = '0' + Math.round((time - Math.floor(time)) * 60)
	return hour.substr(hour.length - 2) + ' : ' + minute.substr(minute.length - 2)
}

export const naturalSortEntries = (array: DropdownEntry[]): DropdownEntry[] => {
	return array.sort((a, b) => {
		return a.text.localeCompare(
			b.text, undefined,
			{ numeric: true, sensitivity: 'base' }
		)
	})
}

export const abbrevateName = (name: string): string => {
	const words = name.split('-')[0].split(' ')
	var abbr = ''
	for (const w of words) {
		if (w === 'i') {
			continue
		} else if (w[0] !== undefined) {
			abbr += w[0].toLocaleUpperCase()
		}
	}
	return abbr
}

export const dropdownObject = (text: string, key: number | string): DropdownEntry => {
	return {
		key: key,
		value: key,
		text: text
	}
}