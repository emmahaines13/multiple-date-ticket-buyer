import { createContext, useContext } from 'react'

const DevPanelOpenContext = createContext(false)

export const DevPanelOpenProvider = DevPanelOpenContext.Provider

export function useDevPanelOpen(): boolean {
  return useContext(DevPanelOpenContext)
}
