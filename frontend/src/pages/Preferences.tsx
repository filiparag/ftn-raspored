import React, { useEffect } from 'react'
import ReactGA from 'react-ga';
import { Header, Segment, Checkbox, Grid, List, Label } from 'semantic-ui-react'
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
        <Header size='medium'>O servisu</Header>
        <List divided verticalAlign='middle' relaxed='very'>
          <List.Item>
            <List.Content floated='right'>
              <Label horizontal color='blue'>
                {preferences.version.join('.')}
                {process.env.NODE_ENV === 'development' ?
                  <Label.Detail>devel</Label.Detail>
                : null}
              </Label>
            </List.Content>
            <List.Content>
              <p>Verzija</p>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content floated='right'>
              <Label horizontal color='blue'>
                {Math.round(new Blob(Object.values(localStorage)).size / 1024 * 10) / 10 + ' kB'}
              </Label>
            </List.Content>
            <List.Content>
              <p>Lokalna memorija</p>
            </List.Content>
          </List.Item>
        </List>
      </Segment>
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