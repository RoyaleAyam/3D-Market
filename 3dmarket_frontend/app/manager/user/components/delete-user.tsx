"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Trash2, AlertTriangle } from "lucide-react"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global"
import { drop } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import Image from "next/image"
import type { IUser } from "@/app/types"

type DeleteUserProps = {
  selectedUser: IUser
}

export default function DeleteUser({ selectedUser }: DeleteUserProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const TOKEN = getCookie("token") || ""
      const url = `${BASE_API_URL}/user/${selectedUser.id}`

      const { data } = await drop(url, TOKEN)

      if (data?.status) {
        toast.success(data.message, {
          hideProgressBar: true,
          containerId: `toastUser`,
        })
        closeModal()
        router.refresh()
      } else {
        toast.warning(data?.message || "Failed to delete user", {
          hideProgressBar: true,
          containerId: `toastUser`,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        hideProgressBar: true,
        containerId: `toastUser`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
        title="Delete User"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-fadeIn text-left">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="pr-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600 flex-shrink-0" />
                  <span className="break-words">Delete User</span>
                </h2>
                <p className="text-gray-600 text-sm break-words">This action cannot be undone.</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-x-hidden">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium break-words overflow-wrap-anywhere">
                    This action cannot be undone. Please confirm carefully.
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-100 rounded-lg mb-6">
                <div className="flex-shrink-0 mr-4">
                  {selectedUser.profile_picture ? (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={`${BASE_IMAGE_PROFILE}/${selectedUser.profile_picture}`}
                        alt={selectedUser.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-xl">
                        {selectedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 break-words">{selectedUser.name}</h3>
                  <p className="text-gray-600 break-all">{selectedUser.email}</p>
                  <div className="mt-1">
                    {selectedUser.role === "ADMIN" ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Manager
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        User
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-yellow-800 font-medium break-words">Important:</p>
                    <p className="text-yellow-700 text-sm mt-1 break-words whitespace-normal overflow-wrap-anywhere">
                      Users with existing transaction data cannot be deleted. If this user has associated records, the
                      deletion may fail.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4 break-words whitespace-normal overflow-wrap-anywhere text-left">
                Are you sure you want to delete this user? This will permanently remove their account from the system.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-4 sticky bottom-0 bg-white z-10">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
