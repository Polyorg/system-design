import React from "react"
import { Theme } from "../types"
import { ThemeContext } from "./Context"

export type ThemeProviderProps = {
  theme: Theme
  children: React.ReactElement
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ ovverrides: {}, palette: {} }}>
      {children}
    </ThemeContext.Provider>
  )
}
