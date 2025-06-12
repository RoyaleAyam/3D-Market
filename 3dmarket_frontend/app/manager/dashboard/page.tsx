"use client"
import { useEffect, useState } from "react"
import { FaCubes } from "react-icons/fa" // Add this for 3D Asset icon
import Link from "next/link"
import Image from "next/image"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { getCookie } from "@/lib/client-cookie"
import { get } from "@/lib/api-bridge"
import { FaClockRotateLeft, FaPerson } from "react-icons/fa6"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import type { FavoriteMenu } from "@/app/types"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const getMenuCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/M`
    const { data } = await get(url, TOKEN)
    if (data?.status) {
      return data.data.length
    }
    return 0
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return 0
  }
}

const getOrderCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/order/allOrders`
    const { data } = await get(url, TOKEN)
    if (data?.status) {
      return data.data.length
    }
    return 0
  } catch (error) {
    console.error("Error fetching order data:", error)
    return 0
  }
}

const getAllUserCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/user/`
    const { data } = await get(url, TOKEN)
    if (data?.status && Array.isArray(data.data)) {
      return data.data.length
    }
    return 0
  } catch (error) {
    console.error("Error fetching user data:", error)
    return 0
  }
}

const getFavoriteMenus = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/report/favorite`
    const { data } = await get(url, TOKEN)

    if (data?.status && Array.isArray(data.data)) {
      const mappedData = data.data.map((item: any) => ({
        ...item,
        orderCount: item.count || item.orderCount || 0,
      }))

      return mappedData.sort((a: FavoriteMenu, b: FavoriteMenu) => (b.orderCount || 0) - (a.orderCount || 0))
    }
    return []
  } catch (error) {
    console.error("Error fetching favorite menu data:", error)
    return []
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const getClassBadge = (Class: string) => {
  switch (Class) {
    case "CC_150_225":
      return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">150cc-225cc</span>
    case "CC_250_UP":
      return <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">250cc & up</span>
    default:
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{Class}</span>
      )
  }
}

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [favoriteMenus, setFavoriteMenus] = useState<FavoriteMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const menuCountData = await getMenuCount()
        const userCountData = await getAllUserCount()
        const orderCountData = await getOrderCount()
        const favoriteMenusData = await getFavoriteMenus()

        setMenuCount(menuCountData)
        setUserCount(userCountData)
        setOrderCount(orderCountData)
        const sortedFavoriteMenus = favoriteMenusData.sort(
          (a: FavoriteMenu, b: FavoriteMenu) => (b.orderCount || 0) - (a.orderCount || 0),
        )
        setFavoriteMenus(sortedFavoriteMenus)
      } catch (error) {
        console.error("Error in fetchData:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare chart data
  const chartData = {
    labels: favoriteMenus.length > 0 ? favoriteMenus.slice(0, 5).map((menu) => menu.brand || "Unknown") : [],
    datasets: [
      {
        label: "Sales Count",
        data: favoriteMenus.length > 0 ? favoriteMenus.slice(0, 5).map((menu) => menu.orderCount || 0) : [],
        backgroundColor: [
          "rgba(37, 99, 235, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(96, 165, 250, 0.7)",
          "rgba(147, 197, 253, 0.7)",
          "rgba(191, 219, 254, 0.7)",
        ],
        borderColor: [
          "rgba(37, 99, 235, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(96, 165, 250, 1)",
          "rgba(147, 197, 253, 1)",
          "rgba(191, 219, 254, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        display: true,
        align: "center" as const,
        labels: {
          boxWidth: 15,
          padding: 10,
          usePointStyle: true,
          pointStyle: "circle" as const,
        },
      },
      title: {
        display: true,
        text: "Most Popular 3D Assets",
        font: {
          size: 16,
        },
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        bottom: 10,
      },
    },
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8 lg:px-12">
      {/* Overview Section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-8 shadow-2xl mb-10 text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h2>
          <Image
            src="/image/Logo_ThreeDimensions.png"
            width={60}
            height={60}
            alt="Horizon Logo"
            className="rounded-full bg-white p-2 shadow-lg border-2 border-blue-200"
          />
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:scale-105 transition-transform border border-white/30">
            <div className="p-4 bg-blue-600 text-white rounded-xl shadow-md flex items-center justify-center">
              <FaCubes size={28} />
            </div>
            <div>
              <p className="text-base font-semibold text-blue-100">3D Assets</p>
              <p className="text-3xl font-bold">{menuCount}</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:scale-105 transition-transform border border-white/30">
            <div className="p-4 bg-blue-600 text-white rounded-xl shadow-md flex items-center justify-center">
              <FaPerson size={28} />
            </div>
            <div>
              <p className="text-base font-semibold text-blue-100">Users</p>
              <p className="text-3xl font-bold">{userCount}</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:scale-105 transition-transform border border-white/30">
            <div className="p-4 bg-blue-600 text-white rounded-xl shadow-md flex items-center justify-center">
              <FaClockRotateLeft size={28} />
            </div>
            <div>
              <p className="text-base font-semibold text-blue-100">Sales History</p>
              <p className="text-3xl font-bold">{orderCount}</p>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/manager/product"
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors font-medium gap-2"
            >
              <FaCubes />
              Manage 3D Assets
            </Link>
            <Link
              href="/manager/user"
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors font-medium gap-2"
            >
              <FaPerson />
              Manage Users
            </Link>
            <Link
              href="/manager/history"
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors font-medium gap-2"
            >
              <FaClockRotateLeft />
              View Sales History
            </Link>
          </div>
        </div>
        {/* Decorative SVG */}
        <svg className="absolute right-0 bottom-0 opacity-20 w-80 h-40" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="200" cy="100" rx="200" ry="100" fill="#fff" />
        </svg>
      </div>

      {/* Popular 3D Assets Section */}
      <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular 3D Assets</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : favoriteMenus.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
            <FaCubes className="mx-auto h-14 w-14 text-gray-400 mb-4" />
            <p className="text-xl font-semibold">No 3D Asset sales data available yet</p>
            <p className="text-base mt-2">Data will appear here once customers start purchasing 3D Assets</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex items-center justify-center">
              <div className="h-72 w-full flex items-center justify-center">
                {favoriteMenus.length > 0 && chartData.datasets[0].data.length > 0 ? (
                  <Pie data={chartData} options={chartOptions} />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>No data available for chart</p>
                  </div>
                )}
              </div>
            </div>
            {/* Top 3 Popular 3D Assets List */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Top 3 Popular 3D Assets</h3>
              <div className="space-y-6">
                {favoriteMenus.slice(0, 3).map((menu, index) => (
                  <div
                    key={`favorite-menu-${menu.id || index}-${index}`}
                    className="flex items-center p-5 border border-gray-100 rounded-2xl hover:bg-blue-50 transition-colors gap-4 shadow-sm"
                  >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      {menu.motorbike_picture ? (
                        <Image
                          fill
                          src={`${BASE_IMAGE_MENU}/${menu.motorbike_picture}`}
                          alt={menu.brand || "3D Asset"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaCubes size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{menu.brand || "Unnamed 3D Asset"}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-base text-gray-500 font-medium">{formatPrice(menu.price || 0)}</p>
                            {menu.Class && getClassBadge(menu.Class)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-bold px-4 py-1 rounded-full ${
                              index === 0
                                ? "bg-blue-100 text-blue-800"
                                : index === 1
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-base text-gray-600">
                        Sold <span className="font-bold">{menu.orderCount || 0}</span> units
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard


// "use client"
// import { useEffect, useState } from "react"
// import { FaMotorcycle, } from "react-icons/fa"
// import Link from "next/link"
// import Image from "next/image"
// import Profile from "../../../public/image/Logo_Horizon.png"
// import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
// import { getCookie } from "@/lib/client-cookie"
// import { get } from "@/lib/api-bridge"
// import {FaClockRotateLeft, FaBowlRice, FaPerson } from "react-icons/fa6"
// import { Pie } from "react-chartjs-2"
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
// import type { FavoriteMenu, IOrder } from "@/app/types"

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend)

// const getMenuCount = async () => {
//   try {
//     const TOKEN = getCookie("token") ?? ""
//     const url = `${BASE_API_URL}/M`
//     const { data } = await get(url, TOKEN)
//     if (data?.status) {
//       return data.data.length
//     }
//     return 0
//   } catch (error) {
//     console.error("Error fetching menu data:", error)
//     return 0
//   }
// }

// const getOrderCount = async () => {
//   try {
//     const TOKEN = getCookie("token") ?? ""
//     const url = `${BASE_API_URL}/order/allOrders`
//     const { data } = await get(url, TOKEN)
//     if (data?.status) {
//       return data.data.length
//     }
//     return 0
//   } catch (error) {
//     console.error("Error fetching order data:", error)
//     return 0
//   }
// }

// const getNewOrderCount = async () => {
//   try {
//     const TOKEN = getCookie("token") ?? ""
//     const url = `${BASE_API_URL}/order/allOrders`
//     const { data } = await get(url, TOKEN)
//     if (data?.status && Array.isArray(data.data)) {
//       // Filter orders with status "NEW"
//       const newOrders = data.data.filter((order: IOrder) => order.status === "NEW")
//       return newOrders.length
//     }
//     return 0
//   } catch (error) {
//     console.error("Error fetching new order data:", error)
//     return 0
//   }
// }

// const getAllUserCount = async () => {
//   try {
//     const TOKEN = getCookie("token") ?? ""
//     const url = `${BASE_API_URL}/user/`
//     const { data } = await get(url, TOKEN)
//     if (data?.status && Array.isArray(data.data)) {
//       return data.data.length
//     }
//     return 0
//   } catch (error) {
//     console.error("Error fetching user data:", error)
//     return 0
//   }
// }

// const getFavoriteMenus = async () => {
//   try {
//     const TOKEN = getCookie("token") ?? ""
//     const url = `${BASE_API_URL}/report/favorite`
//     const { data } = await get(url, TOKEN)
//     console.log("Favorite menu API response:", data)

//     if (data?.status && Array.isArray(data.data)) {
//       // Log the first item to see its structure
//       if (data.data.length > 0) {
//         console.log("First favorite menu item structure:", data.data[0])
//       }

//       // Make sure each item has the correct properties
//       const mappedData = data.data.map((item: any) => ({
//         ...item,
//         // If count is missing, check for alternative properties or default to 0
//         orderCount: item.count || item.orderCount || 0,
//       }))

//       // Sort by orderCount in descending order
//       return mappedData.sort((a: FavoriteMenu, b: FavoriteMenu) => (b.orderCount || 0) - (a.orderCount || 0))
//     }
//     return []
//   } catch (error) {
//     console.error("Error fetching favorite menu data:", error)
//     return []
//   }
// }

// const formatPrice = (price: number): string => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",

