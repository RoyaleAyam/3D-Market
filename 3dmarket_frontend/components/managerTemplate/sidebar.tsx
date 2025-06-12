"use client"
import { type ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import MenuItem from "@/components/userTemplate/menuItem"
import { removeCookie, getCookie } from "@/lib/client-cookie"
import { useRouter, usePathname } from "next/navigation"
import type { IUser } from "@/app/types"
import { BASE_IMAGE_PROFILE } from "@/global"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarClose,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ChevronDown, Bell } from "lucide-react"
import MenuList from "@/app/user/menuList"

type UserProp = {
  children: ReactNode
  id: string
  user: IUser | null
  title: string
}

const SidebarComponent = ({ children, id, title, user }: UserProp) => {
  const [userName, setUserName] = useState<string>("")
  const [forceUpdate, setForceUpdate] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const name = getCookie("name")
    if (name) {
      setUserName(name)
    }

    // Force a refresh when component mounts
    setForceUpdate((prev) => prev + 1)

    // Set up an interval to periodically refresh the profile image
    const intervalId = setInterval(() => {
      setForceUpdate((prev) => prev + 1)
    }, 30000) // Check every 30 seconds

    return () => clearInterval(intervalId)
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

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="flex items-center border-b border-gray-200 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="flex items-center space-x-2 px-4">
              <Image
                src="/image/Logo_Horizon.png"
                alt="Horizon Logo"
                width={40}
                height={40}
                className="rounded-full bg-white p-1"
              />
              <h1 className="font-bold text-xl">HORIZON</h1>
            </div>
            <SidebarClose className="ml-auto text-white hover:bg-blue-800 mr-2" />
          </SidebarHeader>

          <SidebarContent className="bg-white">
            {/* User Profile Card */}
            <div className="mb-6 mx-2 mt-4 overflow-hidden rounded-xl shadow-md">
              <div className="h-20 bg-gradient-to-r from-blue-800 to-blue-600 relative">
                <div className="absolute inset-0 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
                    <path
                      fill="#ffffff"
                      fillOpacity="1"
                      d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="bg-white px-4 pb-4 relative">
                <div className="absolute -top-10 left-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                    {user?.profile_picture ? (
                      <Image
                        src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${new Date().getTime()}`}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized={true}
                        key={`sidebar-profile-${user.profile_picture}-${new Date().getTime()}`}
                      />
                    ) : (
                      <div className="bg-blue-200 h-full w-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-700" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-10">
                  <h3 className="font-bold text-gray-900">{userName || "User"}</h3>
                  <p className="text-sm text-blue-600">Manager Staff</p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/User/profile"
                      className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/User/settings"
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="px-2 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Main Navigation
              </h3>
              <div className="space-y-1">
                {MenuList.map((menu, index) => (
                  <MenuItem
                    key={`menu-${index}`}
                    icon={menu.icon}
                    path={menu.path}
                    label={menu.label}
                    active={pathname.includes(menu.id)}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 py-4 mt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h3>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Today's Sales</span>
                  <span className="text-sm font-semibold text-blue-700">12</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5 mb-4">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Monthly Target</span>
                  <span className="text-sm font-semibold text-blue-700">65%</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 pt-2 bg-white">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md p-3 mx-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all">
          <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-3 flex items-center sticky top-0 z-10 shadow-md">
            <SidebarTrigger className="text-white hover:bg-blue-800" />
            <h1 className="text-xl font-bold ml-3">{title}</h1>

            <div className="ml-auto flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 rounded-full hover:bg-blue-800 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-800 transition-colors">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    {user?.profile_picture ? (
                      <Image
                        src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${new Date().getTime()}`}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized={true}
                        key={`header-profile-${user.profile_picture}-${new Date().getTime()}`}
                      />
                    ) : (
                      <div className="bg-blue-200 h-full w-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-700" />
                      </div>
                    )}
                  </div>
                  <span className="hidden md:inline-block font-medium">{userName || "User"}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 border-b">
                    <p className="text-sm font-medium">{userName || "User"}</p>
                    <p className="text-xs text-gray-500">Manager Staff</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/User/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/User/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 overflow-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default SidebarComponent
