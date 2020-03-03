import React from 'react'
import { List, Icon, Label } from 'semantic-ui-react'
import { TimetableEntry as Entry } from '../store/timetable/types'
import { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic'
import '../style/Timetable.css'


type TimetableEntryProps = {
  entry: Entry,
  ongoing: boolean
}

export const timeString = (time: number): string => {
  let hour = '0' + Math.floor(time)
  let minute = '0' + Math.round((time - Math.floor(time)) * 60)
  return hour.substr(hour.length - 2) + ':' + minute.substr(minute.length - 2)
}

export const typeColor = (type: string): SemanticCOLORS => {
  switch (type) {
    case 'Pred.':
      return 'blue'
    case 'rač.vežbe':
      return 'green'
    case 'aud.vežbe':
      return 'orange'
    case 'lab.vežbe':
      return 'red'
    case 'arh.vežbe':
      return 'brown'
    case 'um.vežbe':
      return 'pink'
    default:
      return 'grey'
  }
}

export const typeIcon = (type: string): SemanticICONS => {
  switch (type) {
    case 'Pred.':
      return 'graduation cap'
    case 'rač.vežbe':
      return 'keyboard'
    case 'aud.vežbe':
      return 'pencil'
    case 'lab.vežbe':
      return 'eye dropper'
    case 'arh.vežbe':
      return 'compass outline'
    case 'um.vežbe':
        return 'paint brush'
    default:
      return 'book'
  }
}

export const typeName = (type: string): string => {
  switch (type) {
    case 'Pred.':
      return 'Predavanje'
    case 'rač.vežbe':
      return 'Računarske vežbe'
    case 'aud.vežbe':
      return 'Auditorne vežbe'
    case 'lab.vežbe':
      return 'Laboratorijske vežbe'
    case 'arh.vežbe':
      return 'Arhitekturne vežbe'
    case 'um.vežbe':
      return 'Umetničke vežbe'
    default:
      return type
  }
}

export const TimetableEntry: React.FC<TimetableEntryProps> = ({entry, ongoing}: TimetableEntryProps) => {
  return (
    <List.Item key={entry.id}>
      <Icon
        name='angle right'
      />
      <List.Content>
        <span>
          {timeString(entry.timeStart)} - {timeString(entry.timeEnd)} {ongoing ? '(u toku)' : null}
        </span>
        <List.Header className='Subject'>
          {entry.subject}
        </List.Header>
        <List.Description>
          <Label
            size='medium'
            icon={typeIcon(entry.type)}
            content={typeName(entry.type)}
            color={typeColor(entry.type)}
            className='Label'
          />
          <Label
            size='medium'
            icon='map marker alternate'
            content={entry.classroom}
            className='Label'
          />
          <Label
            size='medium'
            icon='group'
            content={entry.group}
            className='Label'
          />
          {entry.lecturer.length > 0 ?
          <Label
            size='medium'
            icon='male'
            content={entry.lecturer}
            className='Label Lecturer'
          />
          : null}
        </List.Description>
      </List.Content>
    </List.Item>
  )
}

export default TimetableEntry