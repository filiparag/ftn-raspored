import { SemanticICONS, SemanticCOLORS } from "semantic-ui-react"
import { ReactElement } from "react";

export enum PromptAction {
  SHOW = 'PROMPT_SHOW',
  HIDE = 'PROMPT_HIDE'
}

export interface PromptButton {
  name: string,
  action: Function | null,
  autohide?: boolean,
  icon?: SemanticICONS,
  color?: SemanticCOLORS,
}

export interface PromptObject {
  header: string,
  body: ReactElement | null,
  size: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen',
  actions: Array<PromptButton>
}

export type PromptState = PromptObject | null