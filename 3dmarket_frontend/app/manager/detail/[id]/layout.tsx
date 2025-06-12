"use client"
import ManagerTemplate from "@/components/managerTemplate"
import MenuList from "@/app/manager/menuList"
import { ToastContainer } from "react-toastify"
import type { ReactNode } from "react"

type PropsLayout = {
  children: ReactNode
}

const DetailLayout = ({ children }: PropsLayout) => {
  return (
    <ManagerTemplate title="Motorcycle Details" id="product" menuList={MenuList}>
      {children}
      <ToastContainer containerId="toastMenu" />
    </ManagerTemplate>
  )
}

export default DetailLayout
