"use client"
import { useState, useEffect } from "react"
import React from "react"

import Link from "next/link"
import Image from "next/image"
import { get } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { FiEdit3, FiChevronDown, FiChevronUp, FiRefreshCw } from "react-icons/fi"
import { toast, ToastContainer } from "react-toastify"
import OrderStatusBadge from "./order-status-badge"
import EditOrderModal from "./edit-order-modal"
import type { IOrder } from "@/app/types"
import { FaBowlRice, FaClipboardList, FaRegCalendarCheck } from "react-icons/fa6"
import { motion } from "framer-motion"

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const HistoryPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [expandedOrderDetails, setExpandedOrderDetails] = useState<any>(null)
  const [loadingOrderDetails, setLoadingOrderDetails] = useState<boolean>(false)
  const [activeFilter, setActiveFilter] = useState<string>("ALL")
  const [orderCounts, setOrderCounts] = useState({
    ALL: 0,
    NEW: 0,
    DONE: 0,
  })

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const TOKEN = getCookie("token") || ""
      const url = `${BASE_API_URL}/order/allOrders`
      const { data } = await get(url, TOKEN)

      if (data?.status) {
        console.log("Orders data:", data.data)
        const allOrders = data.data || []
        setOrders(allOrders)

        // Count orders by status
        const counts = {
          ALL: allOrders.length,
          NEW: allOrders.filter((order: IOrder) => order.status === "NEW" || order.status === "PAID").length,
          DONE: allOrders.filter((order: IOrder) => order.status === "DONE").length,
        }
        setOrderCounts(counts)

        // Apply current filter
        filterOrders(allOrders, activeFilter)
      } else {
        console.error("Failed to fetch orders:", data?.message)
        toast.error("Failed to fetch orders. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("An error occurred while fetching orders.")
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = (ordersToFilter: IOrder[], filter: string) => {
    if (filter === "ALL") {
      setFilteredOrders(ordersToFilter)
    } else if (filter === "NEW") {
      setFilteredOrders(ordersToFilter.filter((order) => order.status === "NEW" || order.status === "PAID"))
    } else if (filter === "DONE") {
      setFilteredOrders(ordersToFilter.filter((order) => order.status === "DONE"))
    }
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    filterOrders(orders, filter)
    // Reset expanded row when changing filters
    setExpandedOrderId(null)
    setExpandedOrderDetails(null)
  }

  const fetchOrderDetails = async (orderId: number) => {
    setLoadingOrderDetails(true)
    try {
      const TOKEN = getCookie("token") || ""
      // Fix: Ensure orderId is properly passed as a path parameter
      const url = `${BASE_API_URL}/order/${orderId}`
      const { data } = await get(url, TOKEN)

      if (data?.status) {
        console.log("Order details:", data.data)
        return data.data
      } else {
        console.error("Failed to fetch order details:", data?.message)
        toast.error("Failed to load order details.")
        return null
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast.error("An error occurred while loading order details.")
      return null
    } finally {
      setLoadingOrderDetails(false)
    }
  }

  const handleEditClick = async (order: IOrder, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row expansion when clicking edit button
    try {
      const orderDetails = await fetchOrderDetails(order.id)
      if (orderDetails) {
        setSelectedOrder(orderDetails)
        setIsEditModalOpen(true)
      }
    } catch (error) {
      console.error("Error preparing order for edit:", error)
      toast.error("Failed to prepare order for editing.")
    }
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    fetchOrders() // Refresh the orders list
    if (expandedOrderId) {
      // Refresh expanded order details if any
      toggleExpandRow(expandedOrderId)
    }
  }

  const toggleExpandRow = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
      setExpandedOrderDetails(null)
    } else {
      setExpandedOrderId(orderId)
      try {
        const orderDetails = await fetchOrderDetails(orderId)
        if (orderDetails) {
          setExpandedOrderDetails(orderDetails)
        }
      } catch (error) {
        console.error("Error toggling row expansion:", error)
      }
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateTotalQuantity = (order: any) => {
    if (order.orderLists && Array.isArray(order.orderLists)) {
      return order.orderLists.reduce((sum: number, item: any) => sum + item.quantity, 0)
    }
    return 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "from-red-500 to-red-600"
      case "PAID":
        return "from-yellow-500 to-yellow-600"
      case "DONE":
        return "from-green-500 to-green-600"
      default:
        return "from-blue-500 to-blue-600"
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Tab Navigation */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg cursor-pointer relative overflow-hidden ${activeFilter === "ALL" ? "ring-4 ring-blue-300" : ""}`}
          onClick={() => handleFilterChange("ALL")}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <FaClipboardList size={60} />
          </div>
          <div className="text-white">
            <h3 className="text-lg font-bold">All Orders</h3>
            <p className="text-3xl font-bold mt-2">{orderCounts.ALL}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 shadow-lg cursor-pointer relative overflow-hidden ${activeFilter === "NEW" ? "ring-4 ring-red-300" : ""}`}
          onClick={() => handleFilterChange("NEW")}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <FaClipboardList size={60} />
          </div>
          <div className="text-white">
            <h3 className="text-lg font-bold">New Orders</h3>
            <p className="text-3xl font-bold mt-2">{orderCounts.NEW}</p>
            <p className="text-xs opacity-80 mt-1">Includes NEW and PAID status</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-lg cursor-pointer relative overflow-hidden ${activeFilter === "DONE" ? "ring-4 ring-green-300" : ""}`}
          onClick={() => handleFilterChange("DONE")}
        >
          <div className="absolute right-0 bottom-0 opacity-10">
            <FaRegCalendarCheck size={60} />
          </div>
          <div className="text-white">
            <h3 className="text-lg font-bold">Completed Orders</h3>
            <p className="text-3xl font-bold mt-2">{orderCounts.DONE}</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl p-6 border-t-4 border-t-primary shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {activeFilter === "ALL" ? "All Orders" : activeFilter === "NEW" ? "New Orders" : "Completed Orders"}
            </h4>
            <p className="text-sm text-gray-600">
              {activeFilter === "ALL"
                ? "View and manage all orders regardless of their status"
                : activeFilter === "NEW"
                  ? "Orders that are newly created or paid but not yet completed"
                  : "Orders that have been completed"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchOrders()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <Link
              href="/cashier/pesan_makanan"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md"
            >
              Add Order
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
              <FaClipboardList size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {activeFilter === "ALL"
                ? "There are no orders in the system yet. Create a new order to get started."
                : `There are no orders with ${activeFilter === "NEW" ? "NEW or PAID" : "DONE"} status at the moment.`}
            </p>
            <Link
              href="/cashier/pesan_makanan"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md inline-block"
            >
              Create New Order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order,) => (
                  <React.Fragment key={order.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`hover:bg-gray-50 cursor-pointer ${expandedOrderId === order.id ? "bg-gray-50" : ""}`}
                      onClick={() => toggleExpandRow(order.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`mr-3 p-2 rounded-full bg-gradient-to-r ${getStatusColor(order.status)} text-white`}
                          >
                            {expandedOrderId === order.id ? (
                              <FiChevronUp className="text-white" />
                            ) : (
                              <FiChevronDown className="text-white" />
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(order.total_price)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{order.payment_method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={(e) => handleEditClick(order, e)}
                          className="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                          title="Edit Order"
                        >
                          <FiEdit3 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                    {expandedOrderId === order.id && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-50 border-t border-b border-gray-200"
                          >
                            {loadingOrderDetails ? (
                              <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent"></div>
                                <p className="mt-2 text-gray-600">Loading order details...</p>
                              </div>
                            ) : expandedOrderDetails &&
                              expandedOrderDetails.orderLists &&
                              expandedOrderDetails.orderLists.length > 0 ? (
                              <div className="p-4">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Order Items</h3>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                  <div className="divide-y divide-gray-200">
                                    {expandedOrderDetails.orderLists.map((item: any, index: number) => (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        key={`item-${order.id}-${index}`}
                                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                                      >
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg overflow-hidden relative flex-shrink-0 mr-4 shadow-sm border border-orange-200">
                                          {item.Motorbike?.motorbike_picture ? (
                                            <Image
                                              fill
                                              src={`${BASE_IMAGE_MENU}/${item.Motorbike.motorbike_picture}`}
                                              alt={item.Motorbike.name}
                                              className="object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <FaBowlRice size={24} className="text-orange-400" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">{item.Motorbike?.name}</div>
                                          {item.note && (
                                            <div className="text-sm text-gray-500 mt-1">Note: {item.note}</div>
                                          )}
                                        </div>
                                        <div className="flex items-center">
                                          <div className="text-gray-600 mr-4 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                            x{1}
                                          </div>
                                          <div className="font-semibold text-gray-900">
                                            {formatPrice( (item.Motorbike?.price || 0))}
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                                <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
                                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex-1">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Order Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <p className="text-xs text-blue-900">Customer</p>
                                        <p className="text-sm font-medium text-blue-900">{order.userId}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-900">Payment Method</p>
                                        <p className="text-sm text-blue-900">{order.payment_method}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-900">Order Date</p>
                                        <p className="text-sm text-blue-900">{formatDate(order.createdAt)}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex-1">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Order Summary</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-blue-900">Items:</span>
                                        <span className="font-medium text-blue-900">
                                          {1}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <OrderStatusBadge status={order.status} />
                                      </div>
                                      <div className="flex justify-between pt-2 border-t border-gray-100">
                                        <span className="text-gray-800 font-medium">Total:</span>
                                        <span className="text-lg font-bold text-gray-900">
                                          {formatPrice(order.total_price)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 text-center">
                                <div className="inline-block bg-gray-200 p-3 rounded-full mb-2">
                                  <FaBowlRice size={24} className="text-gray-500" />
                                </div>
                                <p className="text-gray-500">No items in this order</p>
                              </div>
                            )}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {selectedOrder && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          order={selectedOrder}
          onSuccess={handleEditSuccess}
          formatPrice={formatPrice}
        />
      )}
    </div>
  )
}

export default HistoryPage
