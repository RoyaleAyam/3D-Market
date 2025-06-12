"use client"

import UserTemplate from "@/components/userTemplate"
import type React from "react"

import MenuList from "../menuList"
import { ToastContainer } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

type PropsLayout = {
  children: React.ReactNode
}

const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

const RootLayout = ({ children }: PropsLayout) => {
  return (
    <UserTemplate title="Motorcycle Products" id="product" menuList={MenuList}>
      <PageTransition>{children}</PageTransition>
      <ToastContainer containerId={`toastMenu`} />
    </UserTemplate>
  )
}

export default RootLayout
