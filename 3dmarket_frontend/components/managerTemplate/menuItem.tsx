import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utilis"

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  path: string
  active?: boolean
}

const MenuItem = ({ icon, label, path, active }: MenuItemProps) => {
  return (
    <Link
      href={path}
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
        active
          ? "bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-md"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700",
        "group relative overflow-hidden",
      )}
    >
      {/* Hover effect */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200",
          active ? "translate-x-0" : "",
        )}
      ></div>

      <span className={cn("text-xl relative z-10", active ? "text-white" : "text-blue-600")}>
        {/* Render the icon directly */}
        {icon}
      </span>
      <span
        className={cn(
          "font-medium relative z-10 capitalize",
          active ? "" : "group-hover:translate-x-1 transition-transform duration-200",
        )}
      >
        {label}
      </span>
    </Link>
  )
}

export default MenuItem
