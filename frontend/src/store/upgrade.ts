import { Store } from "redux"
import { upgradeVersion } from "./preferences/actions"
import { version } from "punycode"

export interface Version extends Array<number>{}

interface Upgrade {
  version: Version,
  tasks: (store: Store) => Store
}

export const latestVersion: Version = [0,2,0]

const versionParity = (version: Version, target: Version): boolean => {
  if (version[0] < target[0])
    return false
  if (version[1] < target[1])
    return false
  if (version[2] < target[2])
    return false
  return true
}

const upgrades = [] as Upgrade[]

const upgrade = (store: Store): Store => {
  let currentVersion = store.getState().preferences.version
  for (const u of upgrades) {
    if (versionParity(currentVersion, u.version))
      continue
    store = u.tasks(store)
    currentVersion = u.version
  }
  return store
}

export default upgrade