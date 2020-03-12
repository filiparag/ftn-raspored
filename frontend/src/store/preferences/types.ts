export enum PreferencesAction {
  TELEMETRY = 'TELEMETRY',
  UPGRADE = 'UPGRADE',
}

export interface PreferencesState {
  telemetry: boolean,
}