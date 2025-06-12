"use client"
import { type ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import MenuItem from "./menuItem"
import { removeCookie, getCookie } from "@/lib/client-cookie"
import { useRouter, usePathname } from "next/navigation"
import type { IUser } from "@/app/types"
import { BASE_IMAGE_PROFILE } from "@/global"
import { Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utilis"
import DefaultMenuList from "@/app/user/menuList"
import { motion, AnimatePresence } from "framer-motion"

type MenuType = {
  id: string
  icon: ReactNode
  path: string
  label: string
}

type UserProp = {
  children: ReactNode
  id: string
  user?: IUser | null
  title: string
  menuList?: MenuType[] // Make menuList optional
}

const UserTemplate = ({ children, id, title, user, menuList }: UserProp) => {
  const [userName, setUserName] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default to closed
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [profileUpdateTime, setProfileUpdateTime] = useState<number>(Date.now())
  const [forceUpdate, setForceUpdate] = useState(0)
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  // Use the provided menuList or fall back to the default one
  const menuItems = menuList || DefaultMenuList

  useEffect(() => {
    // Force a refresh when component mounts
    setForceUpdate((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const name = getCookie("name")
    if (name) {
      setUserName(name)
    }

    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem("sidebarOpen")
    if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === "true")
    }

    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString())
  }, [sidebarOpen])

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileUpdateTime(Date.now())
    }

    window.addEventListener("profile-updated", handleProfileUpdate)
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate)
    }
  }, [])

  // Handle page transitions
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsPageTransitioning(true)
    }

    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setIsPageTransitioning(false)
      }, 300)
    }

    window.addEventListener("routeChangeStart", handleRouteChangeStart)
    window.addEventListener("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      window.removeEventListener("routeChangeStart", handleRouteChangeStart)
      window.removeEventListener("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [])

  const handleLogout = () => {
    removeCookie("token")
    removeCookie("id")
    removeCookie("name")
    removeCookie("role")
    removeCookie("cart")
    removeCookie("phone_number")
    removeCookie("profile_picture")
    router.replace(`/login`)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed position, doesn't scroll with content */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? "16rem" : "0rem",
          x: sidebarOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 overflow-y-auto shadow-lg")}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center">
          <Link href="/user/dashboard" className="flex items-center space-x-2 text-white">
            <Image
              src="/image/Logo_Horizon.png"
              alt="Horizon Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
            <span className="font-bold text-xl">HORIZON</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-blue-300 shadow-md">
              {user?.profile_picture ? (
                <Image
                  src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${forceUpdate}-${new Date().getTime()}`}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized={true}
                  key={`profile-${user.profile_picture}-${forceUpdate}-${new Date().getTime()}`}
                />
              ) : (
                <div className="bg-blue-100 h-full w-full flex items-center justify-center">
                  <Menu className="h-6 w-6 text-blue-700" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-blue-900 truncate">{userName || "User"}</div>
              <div className="text-sm text-blue-700 truncate">User Staff</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          <AnimatePresence>
            {menuItems.map((menu, index) => (
              <motion.div
                key={`menu-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MenuItem icon={menu.icon} path={menu.path} label={menu.label} active={pathname.includes(menu.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>
      </motion.aside>

      {/* Main Content - Takes full width when sidebar is closed */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "ml-0",
        )}
      >
        {/* Fixed Header - Always visible */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-white hover:bg-blue-800 p-2 rounded-md focus:outline-none transition-transform duration-300"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              style={{ transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-blue-800 transition-colors"
            >
              {/* <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </motion.button>

            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
              {user?.profile_picture ? (
                <Image
                  src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${forceUpdate}-${new Date().getTime()}`}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized={true}
                  key={`header-profile-${user.profile_picture}-${new Date().getTime()}`}
                />
              ) : (
                <div className="bg-blue-200 h-full w-full flex items-center justify-center">
                  <Menu className="h-4 w-4 text-blue-700" />
                </div>
              )}
            </div>
            <span className="hidden md:inline-block font-medium">{userName || "User"}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-800 rounded-md transition-colors ml-4"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </header>

        {/* Scrollable Content Area with Page Transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserTemplate
