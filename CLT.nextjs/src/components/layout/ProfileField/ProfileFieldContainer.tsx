import { ReactNode } from "react"
import { Card } from "../../ui/card"

interface ProfileFieldProps {
  children?: ReactNode
}

export const ProfileFieldContainer = ({ children }: ProfileFieldProps) => {
  return (
    <Card className="flex items-center bg-gray-50 p-2">
      {children}
    </Card>
  )
}