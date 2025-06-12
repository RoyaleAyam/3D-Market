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
  return <div>{children}</div>
}

export default LoginLayout
