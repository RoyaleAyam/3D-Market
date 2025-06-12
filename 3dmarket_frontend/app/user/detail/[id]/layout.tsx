"use client"
import UserTemplate from "@/components/userTemplate"
import MenuList from "@/app/user/menuList"
import { ToastContainer } from "react-toastify"
import type { ReactNode } from "react"

type PropsLayout = {
  children: ReactNode
}

const DetailLayout = ({ children }: PropsLayout) => {
  return (
    <UserTemplate title="Motorcycle Details" id="product" menuList={MenuList}>
      {children}
      <ToastContainer containerId="toastMenu" />
    </UserTemplate>
  )
}

export default DetailLayout
