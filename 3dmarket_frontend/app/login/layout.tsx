import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | HORIZON",
  description: "Sistema de Gerenciamento HORIZON",
}

type PropsLayout = {
  children: React.ReactNode
}

const LoginLayout = ({ children }: PropsLayout) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {children}
    </div>
  )
}

export default LoginLayout
