import React, { useEffect } from 'react'
import ReactGA from 'react-ga';
import { Header, Segment, Checkbox, Grid } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../store';
import { toggleTelemetry } from '../store/preferences/actions'

interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = () => {

  
  const dispatch = useDispatch()
  
  const preferences = useSelector(
    (state: ApplicationState) => state.preferences
    )
    
  useEffect(() => {
    if (preferences.telemetry)
      ReactGA.pageview("/preferences")
  }, [preferences.telemetry])

  return (
    <div>
      <Header size='huge'>Postavke</Header>
      <Segment color='grey' padded>
        <Grid columns={2}>
          <Grid.Column>
            <Header size='medium'>Telemetrija</Header>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Checkbox
              toggle
              defaultChecked={preferences.telemetry}
              onChange={(e, value) => {
                if (preferences.telemetry)
                  ReactGA.event({
                    category: 'Preferences',
                    action: `Telemetry ${value.checked ? 'on' : 'off'}`
                  })
                dispatch(
                  toggleTelemetry(value.checked !== undefined ?
                                  value.checked : true)
                )
              }}
            />
          </Grid.Column>
        </Grid>
        <p>
          Slanjem anonimne telemetrije pomažete razvoju servisa.
        </p>
      </Segment>
    </div>
  )
}

export default Preferences