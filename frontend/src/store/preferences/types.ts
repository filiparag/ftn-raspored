export enum PreferencesAction {
  TELEMETRY = 'TELEMETRY',
}

export interface PreferencesState {
  telemetry: boolean,
  version: [number, number | undefined, number | undefined]
}