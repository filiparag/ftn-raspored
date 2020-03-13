import { SemanticICONS, SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";
import { ReactElement } from "react";

export enum PromptAction {
  SHOW = 'PROMPT_SHOW',
  HIDE = 'PROMPT_HIDE'
}

export interface PromptButton {
  name: string,
  action: Function | null,
  icon?: SemanticICONS,
  color?: SemanticCOLORS
}

export interface PromptObject {
  header: string,
  body: ReactElement | null,
  actions: Array<PromptButton>
}

export type PromptState = PromptObject | null