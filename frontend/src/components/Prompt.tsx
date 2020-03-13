import React from 'react'
import { ApplicationState } from '../store'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Loader as Loading, Dimmer, Modal, Header, Button } from 'semantic-ui-react'
import '../style/Loader.css'
import { hidePrompt } from '../store/prompt/actions'
import { randomKey } from '../App'

type PromptProps = {}

export const Prompt: React.FC<PromptProps> = () => {

  const prompt = useSelector(
    (state: ApplicationState) => state.prompt
  )
  const dispatch = useDispatch()

  if (prompt === null)
    return null
  else {

    const actionButtons = prompt.actions.map(a => {
      return (
        <Button
          key={randomKey()}
          color={a.color}
          icon={a.icon}
          labelPosition={a.icon !== undefined ? 'left' : undefined}
          content={a.name}
          onClick={() => {
            if (a.action !== null)
              a.action()
            dispatch(hidePrompt())
          }}
        />
      )
    })

    console.log(actionButtons)

    return (
      <div className='Prompt'>
        <Modal open={true}>
          <Modal.Header>{prompt.header}</Modal.Header>
          {prompt.body !== null ?
            <Modal.Content>
              <Modal.Description>
                  {prompt.body}
              </Modal.Description>
            </Modal.Content>
          : null}
          <Modal.Actions>
            {actionButtons}
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default Prompt