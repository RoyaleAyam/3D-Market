import Link from "next/link"
import { BikeIcon as Motorcycle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-red-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <Motorcycle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Motorcycle Not Found</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        The motorcycle you're looking for doesn't exist or has been removed from the inventory.
      </p>
      <Link
        href="/user/product"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
      >
        Return to Motorcycle List
      </Link>
    </div>
  )
}
