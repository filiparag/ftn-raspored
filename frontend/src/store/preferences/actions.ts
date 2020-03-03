import { action } from 'typesafe-actions'
import { PreferencesAction } from './types'

export const toggleTelemetry = (value: boolean) => action(PreferencesAction.TELEMETRY, value)