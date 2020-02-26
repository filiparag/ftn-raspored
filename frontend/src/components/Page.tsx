import React from 'react'
import { ApplicationState } from '../store'
import { PageName } from '../store/menu/types'
import { connect } from 'react-redux'
import Timetable from '../pages/Timetable'
import Filters from '../pages/Filters'
import Preferences from '../pages/Preferences'
import '../style/Page.css'

type PageProps = 
ReturnType<typeof mapStateToProps> & {
  page: PageName
}

const Page: React.FC<PageProps> = ({page}) => {
  switch (page) {
    case PageName.TIMETABLE:
      return <Timetable />
    case PageName.FILTERS:
      return <Filters />
    case PageName.PREFERENCES:
      return <Preferences />
    default:
      return <Timetable />
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  page: state.menu.page
})

export default connect(
  mapStateToProps
)(Page)