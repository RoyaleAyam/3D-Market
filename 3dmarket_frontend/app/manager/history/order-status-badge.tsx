import type React from "react"

interface OrderStatusBadgeProps {
  status: string
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
          NEW
        </span>
      )
    case "PAID":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
          PAID
        </span>
      )
    case "DONE":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
          DONE
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
          {status}
        </span>
      )
  }
}

export default OrderStatusBadge
