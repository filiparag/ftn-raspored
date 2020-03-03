import { action } from 'typesafe-actions'
import { PreferencesAction } from './types'
import { Version } from '../upgrade'

export const toggleTelemetry = (value: boolean) => action(PreferencesAction.TELEMETRY, value)

export const upgradeVersion = (version: Version) => action(PreferencesAction.UPGRADE, version)