import React from 'react'
import { Button, Segment, Header } from 'semantic-ui-react'
import { FilterEntry } from '../store/filters/types'
import { useSelector } from 'react-redux'
import { ApplicationState } from '../store'

export interface ExistingFilterProps {
  key: number,
  entry: FilterEntry
}

const ExistingFilter: React.FC<ExistingFilterProps> = ({entry}) => {

  const filter = useSelector(
    (state: ApplicationState) => state.filter
  )

  const findByID = (id: number, array: Array<any>): string => {
    return array[array.findIndex(el => el.id === id)].name
  }

  return (
    <Segment color='green' padded raised>
      <Header size='large'>{}</Header>
      <Header size='medium'>Studijski program</Header>
      <p>
        {entry.studyPrograms.map(el => findByID(el, filter)).join(', ')}
      </p>
    </Segment>
  )
}

export default ExistingFilter