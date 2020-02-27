

import React from 'react'
import { ApplicationState } from '../store'
import { connect } from 'react-redux'
import { Loader as Loading, Dimmer } from 'semantic-ui-react'
import '../style/Loader.css'

type LoaderProps = 
ReturnType<typeof mapStateToProps> & {
  loader: number
}

export const Loader: React.FC<LoaderProps> = ({loader}) => {
  if (loader > 0) {
    return (
      <div className='Loader'>
      <Dimmer inverted active>
        <Loading inverted size='large'></Loading>
      </Dimmer>
      </div>
    )
  } else {
    return null
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  loader: state.loader
});

export default connect(
  mapStateToProps,
)(Loader)