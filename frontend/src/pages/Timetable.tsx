import React from 'react'
import { ApplicationState } from '../store'
import { connect } from 'react-redux'
import TimetableEntry from '../components/TimetableEntry'
import { List, Header } from 'semantic-ui-react'
import '../style/Timetable.css'

type TimetableProps = 
ReturnType<typeof mapStateToProps>

export const Timetable: React.FC<TimetableProps> = ({timetable}) => {

  const dayNames = [
    'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak',
    'Petak', 'Subota', 'Nedelja'
  ]

  const rows = []

  for (const day in timetable) {
    rows.push(<Header size='large'>{dayNames[day]}</Header>)
    for (const c in timetable[day]) {
      rows.push(<TimetableEntry entry={timetable[day][c]} />)
    }
  }


  return (
    <List size='big' relaxed>
      {rows}
    </List>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  timetable: state.timetable
})

export default connect(
  mapStateToProps
)(Timetable)