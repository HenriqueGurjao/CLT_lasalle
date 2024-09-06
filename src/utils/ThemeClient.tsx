"use client"

import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"

interface ThemeClientProps {
  children: ReactNode
}

export const ThemeClient = ({ children }: ThemeClientProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  )
}