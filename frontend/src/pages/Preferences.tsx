import React, { useEffect } from 'react'
import ReactGA from 'react-ga';
import { Header, Segment, Checkbox, Grid } from 'semantic-ui-react'

interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = () => {

  useEffect(() => {
    ReactGA.pageview("/preferences")
  }, [])

  return (
    <div>
      <Header size='huge'>Postavke</Header>
      <Segment color='grey' padded>
        <Grid columns={2}>
          <Grid.Column>
            <Header size='medium'>Telemetrija</Header>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Checkbox toggle defaultChecked/>
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