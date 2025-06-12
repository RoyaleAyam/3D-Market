"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { getCookie } from "@/lib/client-cookie"
import { put } from "@/lib/api-bridge"
import { toast } from "react-toastify"
import OrderStatusBadge from "./order-status-badge"
import { FaBowlRice } from "react-icons/fa6"
import { motion } from "framer-motion"

interface EditOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
  onSuccess: () => void
  formatPrice: (price: number) => string
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onClose, order, onSuccess, formatPrice }) => {
  const [status, setStatus] = useState<string>(order.status || "NEW")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Update status when order changes
  useEffect(() => {
    if (order) {
      setStatus(order.status || "NEW")
    }
  }, [order])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const TOKEN = getCookie("token") || ""
      // Ensure the ID is properly passed as a number
      const orderId = typeof order.id === "string" ? Number.parseInt(order.id, 10) : order.id
      const url = `${BASE_API_URL}/order/${orderId}`

      const payload = {
        status,
      }

      const response = await put(url, JSON.stringify(payload), TOKEN)
      const data = response.data

      if (data?.status) {
        toast.success("Order status updated successfully")
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        toast.error(data?.message || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("An error occurred while updating the order")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "NEW":
        return "bg-red-500"
      case "PAID":
        return "bg-yellow-500"
      case "DONE":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl"
      >
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-bold text-2xl text-gray-900">Edit Order</h2>
            <p className="text-gray-500 text-sm">
              Order #{order.id} - {order.customer}
            </p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Customer</p>
              <p className="text-base font-medium text-gray-900">{order.customer}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Table Number</p>
              <p className="text-base font-medium text-gray-900">{order.table_number}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Payment Method</p>
              <p className="text-base font-medium text-gray-900">{order.payment_method}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Order Items</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {order.orderLists && order.orderLists.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {order.orderLists.map(
                    (
                      item: { Menu: { picture: string; name: string; price: number }; quantity: number; note?: string },
                      index: number,
                    ) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        key={`edit-item-${index}`}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg overflow-hidden relative flex-shrink-0 mr-4 shadow-sm border border-orange-200">
                          {item.Menu?.picture ? (
                            <Image
                              fill
                              src={`${BASE_IMAGE_MENU}/${item.Menu.picture}`}
                              alt={item.Menu.name}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaBowlRice size={24} className="text-orange-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.Menu?.name}</div>
                          {item.note && <div className="text-sm text-gray-500 mt-1">Note: {item.note}</div>}
                        </div>
                        <div className="flex items-center">
                          <div className="text-gray-600 mr-4 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                            x{item.quantity}
                          </div>
                          <div className="font-semibold text-gray-900">
                            {formatPrice(item.quantity * (item.Menu?.price || 0))}
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-block bg-gray-200 p-3 rounded-full mb-2">
                    <FaBowlRice size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-500">No items in this order</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <div className="grid grid-cols-3 gap-3">
                {["NEW", "PAID", "DONE"].map((statusOption) => {
                  const isSelected = status === statusOption
                  let bgColor, borderColor, textColor

                  if (statusOption === "NEW") {
                    bgColor = isSelected ? "bg-red-200" : "bg-red-50"
                    borderColor = "border-red-500"
                    textColor = "text-red-800"
                  } else if (statusOption === "PAID") {
                    bgColor = isSelected ? "bg-yellow-200" : "bg-yellow-50"
                    borderColor = "border-yellow-500"
                    textColor = "text-yellow-800"
                  } else {
                    // DONE
                    bgColor = isSelected ? "bg-green-200" : "bg-green-50"
                    borderColor = "border-green-500"
                    textColor = "text-green-800"
                  }

                  return (
                    <div
                      key={statusOption}
                      className={`relative rounded-lg border-2 ${isSelected ? borderColor : "border-gray-200"} ${bgColor} p-4 cursor-pointer transition-all hover:opacity-90`}
                      onClick={() => setStatus(statusOption)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${getStatusColor(statusOption)}`}></div>
                        <span className={`font-medium ${isSelected ? textColor : "text-gray-700"}`}>
                          {statusOption}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                className="py-2.5 px-5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-md disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default EditOrderModal
